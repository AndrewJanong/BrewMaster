import { createFileRoute } from '@tanstack/react-router'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import ResponsiveDrawer from '../components/SideBar';

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
        const apiUrl = import.meta.env.VITE_API_URL;

        const { status, data, error } = useQuery<Cafe[]>({
            queryKey: ['cafes'],
            queryFn: async () => {
                const response = await axios.get(`${apiUrl}/cafes`);
                const data = await response.data;
                return data;
            }
        });

        if (status === 'pending') return <h1>Loading....</h1>;
        if (status === 'error') return <p>{error.message}</p>;

        return (
            <ResponsiveDrawer>
                <div>
                    {data?.map((cafe) => (
                        <p>{cafe.name}</p>
                    ))}
                </div>
            </ResponsiveDrawer>
        )
    }   
})
