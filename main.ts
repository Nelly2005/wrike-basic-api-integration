import dotenv from 'dotenv';
dotenv.config();

const token = process.env.WRIKE_API_TOKEN;
const url:string = 'https://www.wrike.com/api/v4/tasks?fields=[responsibleIds,parentIds]';

interface task {
    id: string;
    name: string;
    assignees: string[];
    status: string;
    collections: string[];
    created_at: string;
    updated_at: string;
    ticket_url: string;
}

let mappedTasks: task[] = [];

async function getTasks(): Promise<void> {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        mappedTasks = data.data.map((value: any): task => ({
            id: value.id,
            name: value.title,
            assignees: value.responsibleIds,
            status: value.status,
            collections: value.parentIds,
            created_at: value.createdDate,
            updated_at: value.updatedDate,
            ticket_url: value.permalink
        }));

        console.log(mappedTasks);
    } catch (e) {
        console.error('Fetch error:', e);
    }
}

getTasks();
