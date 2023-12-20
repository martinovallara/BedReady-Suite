import * as googleDriveStorage from "../src/infrastructure/services/google-drive-storage";

// mock string-cache
jest.mock("../src/utils/string-cache", () => {
    return {
        getJsonResponseCache: () => { return undefined },
        setJsonResponseCache: jest.fn(),
        clearJsonResponseCache: jest.fn()
    };
});


afterEach(() => {
    jest.restoreAllMocks();
});
describe('readStorageFromDrive and persistToDrive', () => {
    it('should persist and read the same JSON string', async () => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString();

        const jsonString = JSON.stringify({
            key1: "value",
            key2: formattedDate
        });

        await googleDriveStorage.persistToDrive(jsonString);

        await new Promise(resolve => setTimeout(resolve, 1500));

        const persistedJsonString = await googleDriveStorage.readStorageFromDrive();

        expect(persistedJsonString).toEqual(jsonString);
    });
});
