module app{
    export class InternDto{
        internID: string;
        internName: string;
        internBirthday: string;
        internInCompanyDay: string;


        constructor(internID,internName,internBirthday,internInCompanyDay) {
            this.internID = internID;
            this.internName = internName;
            this.internBirthday = internBirthday;
            this.internInCompanyDay = internInCompanyDay;
            
           }
           
    }
}