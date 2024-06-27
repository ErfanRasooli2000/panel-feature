import { utils, writeFile } from "xlsx";

export default async function(fileName, jsonData){
    if (jsonData){
        let myWorkSheet = utils.json_to_sheet(jsonData);
        let myWorkBook = utils.book_new();
        utils.book_append_sheet(myWorkBook, myWorkSheet, "DataSheet");
        await writeFile(myWorkBook, fileName + '.xlsx');
    }
}