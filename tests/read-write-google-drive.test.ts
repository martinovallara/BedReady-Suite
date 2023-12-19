import * as googleDriveApi from "../src/infrastructure/services/google-drive-api";

// crea mock solo per fileName function of google-drive-api.ts
jest
.spyOn(googleDriveApi, 'fileName')
.mockImplementation(() => { return "events-storage-test.json" });



describe('readStorageFromDrive and persistToDrive', () => {
    it('should persist and read the same JSON string', async () => {

        const jsonString =JSON.stringify( {
            key: "value",
            key2: Date.now()
        });

        await googleDriveApi.persistToDrive(jsonString);

        await new Promise(resolve => setTimeout(resolve, 1000));

        const persistedJsonString = await googleDriveApi.readStorageFromDrive();

        expect(persistedJsonString).toEqual(jsonString);

    });
});
