import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
const token: string | undefined = process.env.WRIKE_API_TOKEN;
const url: string = 'https://www.wrike.com/api/v4/tasks?fields=[responsibleIds,parentIds]';

interface IMappedTask {
    id: string;
    name: string;
    assignees: string[];
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
interface IGetResult {
    kind: "tasks",
    data : ITask[]
}
let mappedTasks: IMappedTask[] = [];

async function getTasks() {
    try {
        const response:Response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const getResult:IGetResult = await response.json();

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
        console.error('Fetch error:', e);
    }
}

function writeTasksToFile(filename: string, data: IMappedTask[]): Promise<void> {
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
getTasks();