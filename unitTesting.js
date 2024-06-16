export function addTestPatient(decider) {
    let patient = {}

    switch(decider) {
        case 1:
            patient = {
                firstName:"Kayden",
                lastName:"McManaway",
                dateOfBirth:"2.1.2006",
                address:"8 St James Avenue",
                city:"Richmond",
                conditions:["ADHD", "Other"],
                prescriptions:["Methylphenidate Hydrochloride", "Other"],
                username:"kaydenmc77",
                passwordHash:"098f6bcd4621d373cade4e832627b4f6",
                account:"patient"
            }
        case 2:
            patient = {
                firstName:"Madeline",
                lastName:"Yval",
                dateOfBirth:"1.4.1968",
                address:"23 Churchill Road",
                city:"Nelson",
                conditions:[],
                prescriptions:[],
                username: "madelineyv88",
                passwordHash:"098f6bcd4621d373cade4e832627b4f6",
                account:"provider"
            }
        default:
            patient = {
                firstName:"Bob",
                lastName:"Smith",
                dateOfBirth:"2.12.1998",
                address:"19 Amos Street",
                city:"Richmond",
                conditions:["Depression", "Anxiety"],
                prescriptions:["Fluoxetine", "Other"],
                username:"bobsm99",
                passwordHash:"098f6bcd4621d373cade4e832627b4f6",
                account:"patient"
            }
    }
    
    return patient
}

