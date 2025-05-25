const url:string = 'https://www.wrike.com/api/v4/tasks?fields=[responsibleIds,parentIds]';
const token: string = 'eyJ0dCI6InAiLCJhbGciOiJIUzI1NiIsInR2IjoiMSJ9.eyJkIjoie1wiYVwiOjY5MjAwNjAsXCJpXCI6OTQwMDQ2NSxcImNcIjo0NjkzNjM4LFwidVwiOjIxODk5MTMxLFwiclwiOlwiVVNcIixcInNcIjpbXCJXXCIsXCJGXCIsXCJJXCIsXCJVXCIsXCJLXCIsXCJDXCIsXCJEXCIsXCJNXCIsXCJBXCIsXCJMXCIsXCJQXCJdLFwielwiOltdLFwidFwiOjB9IiwiaWF0IjoxNzQ3MTQyNjg2fQ.8AlRh-aXsSxuESVPB-Ro_8vfCS6KnR8bXxJoqIwyZm0';

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
