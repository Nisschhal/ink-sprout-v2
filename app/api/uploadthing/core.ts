import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  avatarUploader: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(async ({ metadata, file }) => {
    // This code RUNS ON YOUR SERVER after upload
    // console.log("Upload complete for userId:", metadata.userId)

    console.log("file url", file.url)

    // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
    // return { uploadedBy: metadata.userId }
  }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
