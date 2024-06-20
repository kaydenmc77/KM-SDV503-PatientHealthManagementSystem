// Project Health Records Management System

//SECTION Variables
// Imports the inquirer question module
import inquirer from 'inquirer';
// Imports the file system module
import fs from 'fs';
// Imports the path module
import path from 'path';
// Imports the MD5 hashing module
import md5 from 'md5';
// Imports the colours string module
import colors from 'colors'

// Variable to act as a "session" to store user info
let accountID = null;

//SECTION Program Setup

// Sets the file path for the record storage JSON file
const filePath = path.join('./dataSet.json');

// Defines a temporary array to store records in
let records = [];
try {
    // Reads the contents of the dataSet.json file in UTF8 encoding
    let data = fs.readFileSync(filePath, 'utf8');
    // Converts the contents into JS object format and adds them to the "records" array
    records = JSON.parse(data);
} catch (err) {
    // If file doesn't exist, there are no records, meaning the array "records" can stay empty
}

function saveToFile() {
    // Converts the objects in the records array to the JSON string format
    let jsonData = JSON.stringify(records, null, 2);
    // Creates a new file with the given path and adds the converted JSON records to it
    // If file already exists, overwrites it
    fs.writeFileSync(filePath, jsonData);
}


//SECTION Account System
async function startMenu() {
    // Defines question to asks users
    const question = {
        type: 'list',
        name: 'accountchoice',
        message: 'What would you like to do?',
        choices: ['Log In', 'Sign Up', 'Quit']
    };

    // Asks the user if they'd like to sign up, log in or quit the program
    let answer = await inquirer.prompt(question);
    console.log('')

    switch(answer.accountchoice) {
        case 'Log In':
            await logIn()
            break;
        case 'Sign Up':
            await signUp()
            break;
        // Quits program if other option is chosen (Quit)
        default:
            process.exit(0)
    }
    saveToFile()
}

async function logIn() {
    const logInQuestions = [
        {
            type: 'input',
            name: 'username',
            message: 'Enter your username:',
            validate: function (value) {
                // Checks every record to see if a record with the provided username exists, if it is found, allows the users to proceed
                for (let i = 0; i < records.length; i++) {
                    if (value == records[i].username) {
                        // Assigns the index of the account to the temporary session to be accessed for records and password input
                        accountID = i;
                        return true;
                    }
                }
                return 'This username is not in our records';
            }
        },
        {
            type: 'password',
            name: 'password',
            mask: '*',
            message: 'Enter your password:',
            validate: function (value) {
                // Hashs the password the user enters and compares it to the stored hash of the record, allows the user to proceed if it is
                if (records[accountID].password == md5(value)) { return true }
                else { return 'This password is incorrect' }
            }
        }
    ]

    await inquirer.prompt(logInQuestions);
}

async function signUp() {
    const accountCreationQuestions = [
        {
            type: 'input',
            name: 'name',
            message: 'Enter your full name:',
            validate: function (value) {
                // Checks if the answer without white space is 0 characters long
                if (value.trim().length == 0) {
                    // Returns a message to ask the user to retry
                    return 'Please enter a name';
                }
                // If the length of the answer is a character or more, it is accepted as a valid input and returns true to continue the function
                return true;
            }
        },
        {
            type: 'input',
            name: 'dob',
            message: 'Enter your date of birth in the following format (dd.mm.yyyy):',
            validate: function (value) {
                // Checks if date character length is greater than or equal to 8 (1.1.1111 is the minimum amount of characters for a valid date) and less than or equal to 18 (11.11.1111 is the maximum amount of characters for a valid date)
                if (value.trim().length >= 8 && value.trim().length <= 10) {
                    // Seperates the string by the . 
                    let dateArray = value.split(".")
                    // Turns each date string into an integer
                    let day = parseInt(dateArray[0]);
                    let month = parseInt(dateArray[1]);
                    let year = parseInt(dateArray[2]);

                    // Checks if day, month and year are all numbers, if yes, return true
                    if (!isNaN(day) && day > 0 && day <= 31 &&
                        !isNaN(month) && month > 0 && month <= 12 &&
                        !isNaN(year) && year >= 1910 && year <= 2024) {
                        return true;
                    }
                }
                return 'The provided date is invalid... Try again.'
            }
        },
        {
            type: 'input',
            name: 'address',
            message: 'Enter your address:',
            validate: function (value) {
                // Username cannot be empty
                if (value.trim().length > 0) {
                    return true
                }
                else {
                    return 'Please enter an address'
                }
            }
        },
        {
            type: 'list',
            name: 'city',
            message: 'Choose your town/city:',
            choices: ['Nelson', 'Stoke', 'Richmond', 'Motueka', 'Brightwater', 'Wakefield']
        },
        {
            type: 'input',
            name: 'conditions',
            message: 'Enter your conditions, seperated by a comma:'
        },
        {
            type: 'input',
            name: 'prescriptions',
            message: 'Enter your prescriptions, seperated by a comma:'
        },
        {
            type: 'input',
            name: 'username',
            message: 'Enter a username:',
            validate: function (value) {
                // Username cannot be empty
                if (value.trim().length > 0) {
                    // Checks every record to see if the username already exists, allows the user to proceed if not
                    if (records.some(record => record.username === value)) {
                        return 'This username is already taken';
                    }
                    return true
                }
                else {
                    return 'This username is not long enough'
                }
            }
        },
        {
            type: 'password',
            name: 'password',
            mask: '*',
            message: 'Enter a password:',
            validate: function (value) {
                // Checks if entered password, minus the white space is empty
                if (value.trim().length > 0) {
                    // Proceed if not empty
                    return true
                }
                else {
                    return 'Please enter a password'
                }
            }
        },
        {
            type: 'list',
            name: 'account',
            message: 'Are you a patient or a healthcare provider?',
            choices: ['Patient', 'Provider']
        }
    ]

    let account = await inquirer.prompt(accountCreationQuestions);
    // Hashs the password for account security
    account.password = md5(account.password);
    // Adds the account to the records array
    records.push(account);
    // Gets the index of the last record added and sets it as the session account ID
    accountID = ((records.length) - 1);
}

//SECTION Action System
async function actionMenu() {
    console.log('')
    // Defines the temporary ID of an account for providers to use to access patient records
    let accountToView = 0;
    // Defines the available choices for the first question based on the permissions of the account
    // Patients can only access their records while providers can access all records
    let actionMenuChoices = []
    if(records[accountID].account === 'Provider') {
        actionMenuChoices = ['View my records', 'Update my records', 'View all records', `View a patient's records`, `Update a patient's records`, 'Quit']
    }
    else {
        actionMenuChoices = ['View my records', 'Update my records', 'Quit'];
    }
    // Defines the questions to ask the user what action they would like to take
    const questions = [
        {
            type: 'list',
            name: 'actionmenuchoice',
            message: 'What would you like to do?',
            choices: actionMenuChoices
        },
        {
            type: 'input',
            name: 'username',
            message: `What is the username of the patient you would like to update the details of?`,
            validate: function (value) {
                // Checks every account in the record array to see if it exists, adds it to the temporary session info to access it's records later one
                for (let i = 0; i < records.length; i++) {
                    if(value.trim().length !== 0) {
                        if (value == records[i].username) {
                            accountToView = i;
                            return true;
                        }
                    }
                    return 'Please enter a username'
                }
                return 'This username is not in our records';
            }
        }
    ]

    // Asks the user what they would like to do
    let actionChoice = await inquirer.prompt(questions[0])

    // Performs the corresponding action based on the user's choice
    switch(actionChoice.actionmenuchoice) {
        case 'View my records':
            // Shows the user's records in a more readable format
            displaySafeRecords(accountID);
            break;
        case 'Update my records':
            // Calls function to update user's records
            await updateRecords(accountID);
            break;
        case 'View all records':
            // Iterates through the records list and prints the 'pretty' version
            for(let i = 0; i<records.length; i++) {
                displaySafeRecords(i)
            }
            break;
        case `View a patient's records`:
            // Asks the user for the username of the chosen patient, which then finds the relevant array index and sets it as accountToView
            await inquirer.prompt(questions[1]);
            // Shows the patient's records in a more readable format
            displaySafeRecords(accountToView);
            break;
        case `Update a patient's records`:
            // Asks the user for the username of the chosen patient, which then finds the relevant array index and sets it as accountToView
            await inquirer.prompt(questions[1]);
            // Calls function to update the patient's record
            await updateRecords(accountToView);
            break;
        case 'Quit':
            saveToFile()
            // Quits the program
            process.exit()
    }
    // Saves after each rotation to ensure data retention
    saveToFile()
    // Continuously calls back until the program is quit
    actionMenu()
}

// Readable display of records
function displaySafeRecords(accountToView) {
    console.log('');
    console.log('Account'.blue.bold);
    console.log(`${records[accountToView].username}`);
    console.log('');
    console.log('/ Personal Information /'.cyan);
    console.log(`Name: ${records[accountToView].name}`);
    console.log(`Date of Birth: ${records[accountToView].dob}`);
    console.log(`Address: ${records[accountToView].address}`);
    console.log(`City: ${records[accountToView].city}`);
    console.log('/ Medical Information /'.cyan)
    console.log(`Conditions: ${records[accountToView].conditions}`);
    console.log(`Prescriptions: ${records[accountToView].prescriptions}`);
    console.log('');
}

async function updateRecords(accountToUpdate) {
    // Defines the question for which record the user would like to update
    const updateQuestion = {
        type: 'list',
        name: 'choice',
        message: 'Which records would you like to update?',
        choices: ['Conditions', 'Prescriptions']
    }

    // Asks the user which record they would like to update
    let answer = await inquirer.prompt(updateQuestion)
    // Converts the answer into lowercase to be called later on as an object parameter
    let lowerCaseAnswer = answer.choice.toLowerCase();

    const alterations = [
        {
            type: 'input',
            name: 'changes',
            message: `Enter your additional ${lowerCaseAnswer}:`
        }
    ]

    // Allows the user to add a new entry in
    let response = await inquirer.prompt(alterations);
    // Gets the original entries for the relevant record
    let originalEntries = records[accountToUpdate][`${lowerCaseAnswer}`]
    // Combines the old entry with the new entry and sets the record 
    records[accountToUpdate][`${lowerCaseAnswer}`] = `${originalEntries}, ${response.changes}`
}

//SECTION Collation System
async function main() {
    await startMenu()
    // Prevents action menu from running if nobody is logged in
    if(accountID !== null) {
        await actionMenu()
    }
}

// Runs the code
main()