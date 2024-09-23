import { createFileRoute } from '@tanstack/react-router'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import ResponsiveDrawer from '../components/SideBar';

interface Employee {
    id: string;
    name: string;
    email_address: string;
    phone_number: string;
    cafe: string;
    days_worked: number;
}

export const Route = createFileRoute('/employees')({
    component: () => {
        const apiUrl = import.meta.env.VITE_API_URL;

        const { status, data, error } = useQuery<Employee[]>({
            queryKey: ['cafes'],
            queryFn: async () => {
                const response = await axios.get(`${apiUrl}/employees`);
                const data = await response.data;
                return data;
            }
        });

        if (status === 'pending') return <h1>Loading....</h1>;
        if (status === 'error') return <p>{error.message}</p>;

        return (
            <ResponsiveDrawer>
                <div>
                    {data?.map((employee) => (
                        <p>{employee.name}</p>
                    ))}
                </div>
            </ResponsiveDrawer>
            
        )
    }   
})
