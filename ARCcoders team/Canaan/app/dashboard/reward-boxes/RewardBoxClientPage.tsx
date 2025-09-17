"use client";

import { useState } from 'react';
import { useGetRewardBoxes, useDeleteRewardBox } from '@/hooks/useRewardBoxes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RewardBoxForm } from './RewardBoxForm';
import { RewardBox } from '@/types/database.types';
import { Trash2, Edit, Package } from 'lucide-react';

export default function RewardBoxClientPage() {
    const { data: rewardBoxes, isLoading, error } = useGetRewardBoxes();
    const deleteMutation = useDeleteRewardBox();
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRewardBox, setSelectedRewardBox] = useState<RewardBox | null>(null);

    const handleAddNew = () => {
        setSelectedRewardBox(null);
        setIsFormOpen(true);
    };

    const handleEdit = (rewardBox: RewardBox) => {
        setSelectedRewardBox(rewardBox);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this reward box?")) {
            deleteMutation.mutate(id);
        }
    };
    
    const closeForm = () => {
        setIsFormOpen(false);
        setSelectedRewardBox(null);
    }

    if (isLoading) return <div>Loading reward boxes...</div>;
    if (error) return <div>Error: {error.message}</div>;

    if (isFormOpen) {
        return <RewardBoxForm rewardBox={selectedRewardBox} onFinished={closeForm} />;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Manage Reward Boxes</h2>
                <Button onClick={handleAddNew}>Add New Box</Button>
            </div>
            
            <div className="space-y-4">
                {rewardBoxes?.map((box) => (
                    <Card key={box.id}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Package className="w-8 h-8 text-primary" />
                                <div>
                                    <CardTitle>{box.name}</CardTitle>
                                    <CardDescription>{box.type}</CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(box)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(box.id)} disabled={deleteMutation.isPending}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p>{box.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
