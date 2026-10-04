"use client"
import React, { useEffect, useState, useCallback, useRef } from "react"
import { FilePond, registerPlugin } from "react-filepond"
import "filepond/dist/filepond.min.css"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType)

interface UploadedFileInfo {
  name: string
  url: string
}

interface DocumentFile {
  file_type: string
  file: string
  file_url?: string
}

interface Props {
  existingLogo?: DocumentFile[]
  fileType: string
  onUpload: (docs: DocumentFile[]) => void
  onRemove?: (removedFile: string) => void
  multiSelect?: boolean
}

async function uploadFileToS3(file: File): Promise<UploadedFileInfo> {
  const timestamp = Date.now()
  const uniqueName = `${timestamp}_${file.name.trim().replace(/\s+/g, "_")}`

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/generate-presigned-url/?filename=${encodeURIComponent(uniqueName)}&expiration=3600`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    },
  )
  if (!res.ok)
    throw new Error(`Failed to fetch presigned URL: ${res.statusText}`)
  const { presigned_url, content_type } = await res.json()
  if (!presigned_url) throw new Error("Presigned URL not provided")
  const uploadRes = await fetch(presigned_url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": content_type || "application/octet-stream",
      // "Content-Type": file.type || "application/octet-stream",
    },
  })
  if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.statusText}`)

  return { name: uniqueName, url: presigned_url.split("?")[0] }
}

function extractFileName(url: string): string {
  return url.substring(url.lastIndexOf("/") + 1)
}

export default function ImageUploader({
  existingLogo,
  fileType,
  onUpload,
  onRemove,
  multiSelect = false,
}: Props) {
  const [files, setFiles] = useState<any[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [fileMetadata, setFileMetadata] = useState<
    { url: string; name: string }[]
  >([])
  const filePondRef = useRef<any>(null)
  const mutationObserverRef = useRef<MutationObserver | null>(null)
  const uniqueId = useRef(
    `filepond-${fileType}-${Math.random().toString(36).slice(2)}`,
  )

  useEffect(() => {
    if (existingLogo && existingLogo.length > 0) {
      const initialFiles = existingLogo.map((doc) => ({
        source: doc.file_url
          ? doc.file_url
          : `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${doc.file}`,
        options: { type: "local" },
      }))
      setFiles(initialFiles)
      setFileMetadata(
        existingLogo.map((doc) => ({
          url:
            doc.file_url ||
            `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${doc.file}`,
          name: doc.file,
        })),
      )
    } else {
      setFiles([])
      setFileMetadata([])
    }
  }, [existingLogo])

  const isImageFile = (fileName: string) =>
    /(\.jpg|\.jpeg|\.png|\.gif|\.webp|\.heic)$/i.test(fileName)

  const addIconsToFileItems = useCallback(() => {
    const pondRoot = document.getElementById(uniqueId.current)
    if (!pondRoot) return
    const fileItems = pondRoot.querySelectorAll(".filepond--item")

    fileItems.forEach((item, index) => {
      if (item.querySelector(".custom-icon-container")) return
      const fileData = fileMetadata[index]
      if (!fileData) return

      const { url: fileUrl, name: fileName } = fileData
      console.log(
        `Index: ${index}, File URL: ${fileUrl}, File Name: ${fileName}`,
      )

      const iconContainer = document.createElement("div")
      iconContainer.className = "custom-icon-container"

      if (isImageFile(fileName)) {
        const previewButton = document.createElement("button")
        previewButton.className = "icon-btn"
        previewButton.title = "Preview"
        previewButton.type = "button"
        previewButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>`
        previewButton.onclick = (e) => {
          e.stopPropagation()
          setPreviewImage(fileUrl)
        }
        iconContainer.appendChild(previewButton)
      }

      const downloadButton = document.createElement("a")
      downloadButton.className = "icon-btn"
      downloadButton.title = "Download"
      downloadButton.href = fileUrl
      downloadButton.download = fileName
      downloadButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`
      downloadButton.onclick = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        try {
          const resp = await fetch(fileUrl)
          const blob = await resp.blob()
          const tempLink = document.createElement("a")
          tempLink.href = URL.createObjectURL(blob)
          tempLink.download = fileName
          document.body.appendChild(tempLink)
          tempLink.click()
          document.body.removeChild(tempLink)
        } catch (err) {
          console.error("Download error:", err)
        }
      }

      iconContainer.appendChild(downloadButton)
      item.appendChild(iconContainer)
    })
  }, [fileMetadata])

  useEffect(() => {
    if (mutationObserverRef.current) mutationObserverRef.current.disconnect()
    const pondRoot = document.getElementById(uniqueId.current)
    if (!pondRoot) return
    mutationObserverRef.current = new MutationObserver(() => {
      setTimeout(addIconsToFileItems, 100)
    })
    mutationObserverRef.current.observe(pondRoot, {
      childList: true,
      subtree: true,
    })
    addIconsToFileItems()
    return () => mutationObserverRef.current?.disconnect()
  }, [addIconsToFileItems])

  const handleUpdateFiles = useCallback(
    (fileItems: any[]) => {
      setFiles(fileItems)
      setTimeout(addIconsToFileItems, 100)
    },
    [addIconsToFileItems],
  )

  return (
    <div className="relative rounded-md p-2">
      <style>{`
        .custom-icon-container {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 50;
          display: flex;
          gap: 4px;
          border-radius: 6px;
          padding: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          cursor: pointer;
          border: none;
          transition: background 0.2s ease;
        }
        .icon-btn:hover {
          opacity: 0.7;
        }
      `}</style>

      <FilePond
        ref={filePondRef}
        id={uniqueId.current}
        files={files}
        onupdatefiles={handleUpdateFiles}
        allowMultiple={multiSelect}
        maxFiles={multiSelect ? null : 1}
        name="company_logo"
        labelIdle='<span class="text-sm">Choose The File</span>'
        imagePreviewHeight={150}
        credits={false}
        server={{
          process: async (
            _fieldName,
            file,
            _metadata,
            load,
            error,
            _progress,
            _abort,
          ) => {
            try {
              const data = await uploadFileToS3(file as File)
              const fileName = extractFileName(data.url)
              const presignedRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/generate_presigned_url_files/${encodeURIComponent(fileName)}?expiration=600`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                  },
                },
              )
              const { url } = await presignedRes.json()
              load(url)
              setFileMetadata((prev) => [...prev, { url, name: fileName }])
              const newDoc: DocumentFile = {
                file_type: fileType,
                file: fileName,
                file_url: url,
              }
              if (multiSelect) {
                const currentDocs = existingLogo || []
                onUpload([...currentDocs, newDoc])
              } else {
                onUpload([newDoc])
                setFileMetadata([{ url, name: fileName }])
              }
            } catch (err) {
              error(`Upload failed: ${err instanceof Error ? err.message : "Unknown error"}`)
            }
            return { abort: () => error("Upload aborted") }
          },
          load: (source, load, error, _progress, abort) => {
            fetch(source)
              .then((r) => r.blob())
              .then((blob) => load(blob))
              .catch(() => {
                error("Could not load file")
                abort()
              })
          },
          remove: (source, load, error) => {
            try {
              const fileName = existingLogo?.find(
                (doc) =>
                  doc.file_url === source ||
                  `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${doc.file}` ===
                    source,
              )?.file
              if (!fileName) return error("File not found for removal")
              const updatedDocs = (existingLogo || []).filter(
                (doc) => doc.file !== fileName,
              )
              setFileMetadata((prev) =>
                prev.filter((meta) => meta.name !== fileName),
              )
              onUpload(updatedDocs)
              onRemove?.(fileName)
              load()
            } catch {
              error("Remove failed")
            }
          },
        }}
        onprocessfile={() => setTimeout(addIconsToFileItems, 100)}
      />

      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <img
            src={previewImage}
            alt="Preview"
            className="max-h-[90%] max-w-[90%] rounded shadow-lg"
          />
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-3xl font-bold text-white hover:bg-black/80"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
