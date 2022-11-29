import {
    getTagDetails,
    createTag,
    updateTag,
    deleteTag,
  } from "./tags";
  
  describe("tags module", () => {
    describe("createTag", () => {
      it("should make a request to the correct endpoint", async () => {
        fetch.mockResponseOnce(JSON.stringify({}));
        await createTag({
          token: "token",
          body: [{ name: "CLOUDCLAPP_TAGS", value: 'test_name:test_value,' }],
          orgId: "test_org",
        });
  
        expect(fetch.mock.calls.length).toEqual(1);
        expect(fetch.mock.calls[0][0]).toEqual(
          "/ubi-api-rest/operator/id/test_org/variables",
        );
        expect(fetch.mock.calls[0][1].method).toEqual("POST");
      });
    });
  
    describe("updateTag", () => {
        it("should make a request to the correct endpoint", async () => {
          fetch.mockResponseOnce(JSON.stringify({}));
          await updateTag({
            token: "token",
            body: [{ name: "CLOUDCLAPP_TAGS", value: 'test_name:test_value,' }],
            orgId: "test_org",
          });
    
          expect(fetch.mock.calls.length).toEqual(1);
          expect(fetch.mock.calls[0][0]).toEqual(
            "/ubi-api-rest/operator/id/test_org/variables",
          );
          expect(fetch.mock.calls[0][1].method).toEqual("PUT");
        });
      });

    describe("getTagDetails", () => {
      it("should make a request to the correct endpoint", async () => {
        fetch.mockResponseOnce(JSON.stringify({}));
        await getTagDetails({
          token: "token",
          orgId: "test_org",
        });
  
        expect(fetch.mock.calls[0][0]).toEqual(
          "/ubi-api-rest/operator/id/test_org/variables",
        );
        expect(fetch.mock.calls[0][1].method).toEqual("GET");
      });
    });
  
    describe("deleteTag", () => {
      it("should make a request to the correct endpoint", async () => {
        fetch.mockResponseOnce(JSON.stringify({}));
        await deleteTag({
          token: "token",
          orgId: "test_org",
        });
  
        expect(fetch.mock.calls[0][0]).toEqual(
          "/ubi-api-rest/operator/id/test_org/variables",
        );
        expect(fetch.mock.calls[0][1].method).toEqual("DELETE");
      });
    });
  });
  

  