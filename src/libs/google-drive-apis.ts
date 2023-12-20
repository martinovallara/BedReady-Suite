
import { drive_v3 } from "@googleapis/drive";

const googleDriveApis = {
    createOrUpdateFile,
    getFileIdFromFilename,
    readJsonContentFromDrive,
    readToDrive
}

export default googleDriveApis;

async function readJsonContentFromDrive(drive: drive_v3.Drive, fileId: string) {
    const fileContent = await readToDrive(drive, fileId) as string;
    return JSON.stringify(fileContent);
}

async function createOrUpdateFile(drive: drive_v3.Drive,
    fileName: string,
    folderId: string, content: string) {

    const fileMetadata = {
        name: fileName,
        parents: [folderId]
    };
    const media = {
        mimeType: 'text/plain',
        body: content
    };

    try {
        // Check if the file exists
        const existingFileId = await getFileIdFromFilename(drive, fileName, folderId);
        let file;
        if (existingFileId === undefined || existingFileId === null) {
            // File does not exist, create new file
            file = await drive.files.create({
                requestBody: fileMetadata,
                media: media,
                fields: 'id'
            });
            //console.log('File created, ID:', file.data.id);
        } else {
            // File exists, update existing file
            file = await drive.files.update({
                fileId: existingFileId,
                media: media
            });
            //console.log('File updated, ID:', existingFileId);
            //console.log('content:', JSON.stringify(file.config.data, null, 2));
        }

        return file.data.id;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}

async function getFileIdFromFilename(drive: drive_v3.Drive,
    fileName: string,
    folderId: string): Promise<string | undefined | null> {

    const fileList = await drive.files.list({
        q: `name='${fileName}' and '${folderId}' in parents and trashed=false`,
        spaces: 'drive',
        fields: 'files(id, name)'
    });

    return (fileList.data.files as drive_v3.Schema$File[])[0]?.id;
}

async function readToDrive(drive: drive_v3.Drive, fileId: string) {
    const response = await drive.files.get({
        fileId: fileId,
        alt: 'media',
    }, { responseType: 'json' });
    return response.data
}



