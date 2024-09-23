import { createFileRoute } from '@tanstack/react-router'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

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
        const { status, data, error } = useQuery<Employee[]>({
            queryKey: ['cafes'],
            queryFn: async () => {
                const response = await axios.get('http://localhost:4000/employees');
                const data = await response.data;
                return data;
            }
        });

        if (status === 'pending') return <h1>Loading....</h1>;
        if (status === 'error') return <p>{error.message}</p>;

        return (
            <div>
                {data?.map((employee) => (
                    <p>{employee.name}</p>
                ))}
            </div>
            
        )
    }   
})
