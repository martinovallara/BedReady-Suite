import googleDriveApis from "../src/libs/google-drive-apis";
import * as googleDriveStorage from "../src/infrastructure/services/google-drive-storage";
import { clearJsonResponseCache, getJsonResponseCache } from "../src/utils/string-cache.js";

// mock googleDriveApis
jest.mock("../src/libs/google-drive-apis", () => {
    return {
        createOrUpdateFile: jest.fn(),
        getFileIdFromFilename: () => "fileId",
        readJsonContentFromDrive: () => "jsonContent"
    };
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('readStorageFromDrive with caching', () => {
    it('should use cache on second read', async () => {
        // reset cache before test
        clearJsonResponseCache();
        expect(getJsonResponseCache()).toBeUndefined();

        // Mock the function readJsonContentFromDrive
        const readJsonContentFromDrive = jest
            .spyOn(googleDriveApis, 'readJsonContentFromDrive')


        // Call readToDrive twice
        await googleDriveStorage.readStorageFromDrive();
        expect(getJsonResponseCache()).toBeDefined();
        await googleDriveStorage.readStorageFromDrive();

        // Expect readToDrive to be called only once
        expect(readJsonContentFromDrive).toHaveBeenCalledTimes(1);

        // Clean up the mock
        readJsonContentFromDrive.mockRestore();
    });

    it('should set cache on persistToDrive and readStorageFromDrive use cache', async () => {
        // reset cache before test
        clearJsonResponseCache();
        expect(getJsonResponseCache()).toBeUndefined();

        // Mock the function readJsonContentFromDrive
        const readJsonContentFromDrive = jest
            .spyOn(googleDriveApis, 'readJsonContentFromDrive')


        await googleDriveStorage.persistToDrive("test");
        expect(getJsonResponseCache()).toBeDefined();

        await googleDriveStorage.readStorageFromDrive();
        expect(readJsonContentFromDrive).toHaveBeenCalledTimes(0);

    });
});
