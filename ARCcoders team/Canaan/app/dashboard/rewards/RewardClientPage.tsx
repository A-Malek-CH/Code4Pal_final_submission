"use client";

import { useState } from 'react';
import { useGetRewards, useDeleteReward } from '@/hooks/useRewards';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RewardForm } from './RewardForm';
import { Reward } from '@/types/database.types';
import { Trash2, Edit } from 'lucide-react';

export default function RewardClientPage() {
    const { data: rewards, isLoading, error } = useGetRewards();
    const deleteMutation = useDeleteReward();
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

    const handleAddNew = () => {
        setSelectedReward(null);
        setIsFormOpen(true);
    };

    const handleEdit = (reward: Reward) => {
        setSelectedReward(reward);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this reward?")) {
            deleteMutation.mutate(id);
        }
    };
    
    const closeForm = () => {
        setIsFormOpen(false);
        setSelectedReward(null);
    }

    if (isLoading) return <div>Loading rewards...</div>;
    if (error) return <div>Error: {error.message}</div>;

    if (isFormOpen) {
        return <RewardForm reward={selectedReward} onFinished={closeForm} />;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Manage Rewards</h2>
                <Button onClick={handleAddNew}>Add New Reward</Button>
            </div>
            
            <div className="space-y-4">
                {rewards?.map((reward) => (
                    <Card key={reward.id}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center space-x-4">
                               <img src={reward.icon} alt={reward.name} className="w-10 h-10 rounded-full" />
                                <div>
                                    <CardTitle>{reward.name}</CardTitle>
                                    <CardDescription>{reward.type}</CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(reward)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(reward.id)} disabled={deleteMutation.isPending}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p>{reward.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
