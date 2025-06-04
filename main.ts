import dotenv from 'dotenv';
dotenv.config();
import fs from "fs";
const token: string | undefined = process.env.WRIKE_API_TOKEN;
const url: string = 'https://www.wrike.com/api/v4/tasks?fields=[responsibleIds,parentIds]';

interface mappedTask {
    id: string;
    name: string;
    assignees: string[];
    status: string;
    collections: string[];
    created_at: string;
    updated_at: string;
    ticket_url: string;
}
interface task {
    id: string,
    accountId: string,
    title: string,
    parentIds: string[],
    responsibleIds: string[],
    status: string,
    importance: string,
    createdDate: string,
    updatedDate: string,
    dates: {
    type: string
},
    scope: string,
    customStatusId: string,
    permalink: string,
    priority: string
}

let mappedTasks: mappedTask[] = [];

async function getTasks(): Promise<void> {
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

        const getResult:{kind: "tasks", data : task[]} = await response.json();

        mappedTasks = getResult.data.map((value: task): mappedTask => ({
            id: value.id,
            name: value.title,
            assignees: value.responsibleIds,
            status: value.status,
            collections: value.parentIds,
            created_at: value.createdDate,
            updated_at: value.updatedDate,
            ticket_url: value.permalink
        }));

        await fs.promises.writeFile('tasks.json', JSON.stringify(mappedTasks, null, 2));
        console.log('tasks.json has been saved!');
    } catch (e) {
        console.error('Fetch error:', e);
    }
}

getTasks();

// fetch(url,
//     {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     })
//     .then(response  => response.json())
//     .then((result:any):void=>{
//         mappedTasks = result.data.map((value:any):task =>
//              ({
//                 id: value.id,
//                 name: value.title,
//                 assignees: value.responsibleIds,
//                 status: value.status,
//                 collections: value.parentIds,
//                 created_at: value.createdDate,
//                 updated_at: value.updatedDate,
//                 ticket_url: value.permalink
//             })
//         );
//        fs.writeFile('tasks.json', JSON.stringify(mappedTasks, null, 2), (err: NodeJS.ErrnoException | null) => {
//            if (err) {console.log("omg error:",err);}
//            else {
//                console.log('great great!!');
//            }
//        })
//     })
//     .catch(err=>{
//         console.log(err);
//     });