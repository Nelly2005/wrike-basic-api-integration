import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
const token: string | undefined = process.env.WRIKE_API_TOKEN;
const urlTasks: string = 'https://www.wrike.com/api/v4/tasks?fields=[responsibleIds,parentIds]';
const urlContacts: string = 'https://www.wrike.com/api/v4/contacts';
const urlProjects: string = 'https://www.wrike.com/api/v4/folders';
let mappedTasks: IMappedTask[] = [];
let mappedContacts : IContact[] = [];
let mappedProjects : IProject[] = [];
let projectData: IProject[] = [];
interface IMappedTask {
    id: string;
    name: string;
    assignees: (string | IContact)[];
    status: string;
    collections: string[];
    created_at: string;
    updated_at: string;
    ticket_url: string;
}
interface ITask {
    id: string,
    title: string,
    parentIds: string[],
    responsibleIds: string[],
    status: string,
    createdDate: string,
    updatedDate: string,
    permalink: string
}
interface ITasksGetResult {
    kind: "tasks",
    data : ITask[]
}

interface IContactsGetResult {
    kind: "accounts",
    data : IContact[]
}
interface IProjectsGetResult {
    kind: "folderTree",
    data : IProject[]
}
interface IContact {
    id: string,
    firstName: string,
    lastName: string,
    type: string,
    email: string,
}
interface IProject {
    id: string,
    title: string,
    childIds: string[],
    scope: string,
    tasks?: (IMappedTask | string)[]
}
interface IData{
    projects: IProject[];
}
async function fetching(url:string){
    const response:Response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
}
async function getContacts(){
    try {
        const getResult:IContactsGetResult = await fetching(urlContacts);
        mappedContacts = getResult.data.map((value:IContact):IContact=>({
            id: value.id,
            firstName: value.firstName,
            lastName: value.lastName,
            type: value.type,
            email: value.email
        }))

        await writeTasksToFile('contacts.json', mappedContacts);
        console.log(`Successfully added contacts`);
    } catch (e) {
        console.error('Fetch error (Contacts):', e);
    }
}
async function getProjects(){
    try {
        const getResult:IProjectsGetResult = await fetching(urlProjects);
        mappedProjects = getResult.data.map((value:IProject):IProject=>({
            id: value.id,
            title: value.title,
            childIds: value.childIds,
            scope: value.scope
        }))
        await writeTasksToFile('projects.json', mappedProjects);
        console.log(`Successfully added projects`);
    } catch (e) {
        console.error('Fetch error (Projects):', e);
    }
}
async function getTasks() {
    try {
        const getResult:ITasksGetResult = await fetching(urlTasks);
        mappedTasks = getResult.data.map((value): IMappedTask => ({
            id: value.id,
            name: value.title,
            assignees: value.responsibleIds,
            status: value.status,
            collections: value.parentIds,
            created_at: value.createdDate,
            updated_at: value.updatedDate,
            ticket_url: value.permalink
        }));

        await writeTasksToFile('tasks.json', mappedTasks);
        console.log(`Successfully added tasks`);
    } catch (e) {
        console.error('Fetch error (tasks):', e);
    }
}

function writeTasksToFile(filename: string, data: IMappedTask[] | IContact[]| IProject[]| IData): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, JSON.stringify(data, null, 2), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    })
}

function makeData(){
    let modifiedTasks = mappedTasks.map(task=>{
        for(let i = 0; i < task.assignees.length; i++){
            for(let j = 0; j < mappedContacts.length;j++){
                if(task.assignees[i] === mappedContacts[j].id){
                    //console.log(mappedContacts[j]);
                    task.assignees[i] = mappedContacts[j];
                    break;
                }
            }
        }
        return task;
    })
    //console.log(newTasks);
    projectData = mappedProjects.map((project):IProject=>{
        project.tasks =[];
        for(let i = 0; i < modifiedTasks.length; i++){
            for(let j = 0; j < modifiedTasks[i].collections.length; j++){
                if(modifiedTasks[i].collections[j] === project.id){
                    project.tasks.push(modifiedTasks[i]);
                }
            }
        }
        return project;
    });
    const data : IData = {
        projects: projectData,
    }
    writeTasksToFile('data.json', data)
        .then(()=>{
            console.log(`Successfully added data.json`);
        });
}

Promise.all([getTasks(), getProjects(),getContacts()])
    .then(()=>makeData());











