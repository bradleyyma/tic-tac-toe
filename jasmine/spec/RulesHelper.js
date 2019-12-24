  describe("checking if isEmpty works", function(){

    it("should return false if string=\"Hello!\"", function(){
      expect(isEmpty("Hello!")).toEqual(false);
    });

    it("should return true if string = \"\"", function(){
      expect(isEmpty("")).toEqual(true);
    });

    it("should return true is string is undefined", function(){
      expect(isEmpty(undefined)).toEqual(true);
    });
  });
