import { createFileRoute } from '@tanstack/react-router'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// Define the cafe interface
interface Cafe {
    id: string;
    name: string;
    description: string;
    logo: string;
    location: string;
    employees: number;
}

export const Route = createFileRoute('/cafes')({
    component: () => {
        const { status, data, error } = useQuery<Cafe[]>({
            queryKey: ['cafes'],
            queryFn: async () => {
                const response = await axios.get('http://localhost:4000/cafes');
                const data = await response.data;
                return data;
            }
        });

        if (status === 'pending') return <h1>Loading....</h1>;
        if (status === 'error') return <p>{error.message}</p>;

        return (
            <div>
                {data?.map((cafe) => (
                    <p>{cafe.name}</p>
                ))}
            </div>
            
        )
    }   
})
