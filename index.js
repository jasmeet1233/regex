const fs = require("fs");
const ObjectsToCsv = require("objects-to-csv");
const personReference = /[A-Z]{2}\d{8}-\d{5}/g;
const personMobile = /\(\d{3}\)\s\d{3}-\d{4}/g;
const personDate = /\d{2}\s\w{3}\s\d{4}\s\d{2}:\d{2}\s[A-Z]{2}/g;
const personName = /\">[A-Za-z]{3,}\s[\s]?[A-Za-z]{3,}/g;
const personAddress =
  /(\w{1,}\s*\w{1,}\s\w{1,},\s)?(\w{1,}\s)?(\w{1,},\s)?(\w(1,)\s)?(\w{1,}\s)?(\w{1,}\s)?(\w{1,}\s\w{1,},\s)?\w{1,},\s*(\s*|\w{1,})\s\w{1,},\s\w{1,},.\d{5}/g;
const personStatus = /[A-Z]{9}/g;
const personNameHTML =
  /<tr>(\s*<td.{1,}\s*.{1,}\s*.{1,}\s*<td.{1,}\s*<td.{1,}\s*.{1,}\s*<td.{1,}\s*<td.{1,}\s*<td.{1,}\s*<td.{1,}\s*<td.{1,}\s*)\s*<\/tr>/g;

  const dataObjects = []

fs.readFile(
  "/home/savera/projects/regex/sample-example.html",
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const reference = data.match(personReference);
    const mobile = data.match(personMobile);
    const date = data.match(personDate);
    const name = data.match(personNameHTML);
    const address = data.match(personAddress);
    const status = data.match(personStatus);
    let agentName = [];
    let patientName = [];

    for (let i = 0; i < name.length; i++) {
      const pName = name[i].match(personName);
      patientName.push(pName[0].substring(2));
    }

    for (let i = 0; i < name.length; i++) {
      const pName = name[i].match(personName);
      if (pName.length === 1) {
        agentName.push("N/A");
      } else {
        agentName.push(pName[1].substring(2));
      }
    }



    //Making of CSV-------------------------------
    for(let i = 0; i<34; i++){
      const data = {
        Appointment_Reference: reference[i],
        Patient_Name: patientName[i],
        Patient_Address: address[i],
        Patient_Phone: mobile[i],
        Agent_name: agentName[i],
        Application_Status: status[i],
        Application_Date_Time: date[i]
      }
      dataObjects.push(data)
    }

    const csv = new ObjectsToCsv(dataObjects);
    await csv.toDisk('./list.csv')

    //-------------------
  }
);
