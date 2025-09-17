"use client";

import { useState } from 'react';
import { useGetChallenges, useDeleteChallenge } from '@/hooks/useChallenges';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChallengeForm } from './ChallengeForm';
import { Challenge } from '@/types/database.types';
import { Trash2, Edit, Trophy } from 'lucide-react';

export default function ChallengeClientPage() {
    const { data: challenges, isLoading, error } = useGetChallenges();
    const deleteMutation = useDeleteChallenge();
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

    const handleAddNew = () => {
        setSelectedChallenge(null);
        setIsFormOpen(true);
    };

    const handleEdit = (challenge: Challenge) => {
        setSelectedChallenge(challenge);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this challenge?")) {
            deleteMutation.mutate(id);
        }
    };
    
    const closeForm = () => {
        setIsFormOpen(false);
        setSelectedChallenge(null);
    }

    if (isLoading) return <div>Loading challenges...</div>;
    if (error) return <div>Error: {error.message}</div>;

    if (isFormOpen) {
        return <ChallengeForm challenge={selectedChallenge} onFinished={closeForm} />;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Manage Challenges</h2>
                <Button onClick={handleAddNew}>Add New Challenge</Button>
            </div>
            
            <div className="space-y-4">
                {challenges?.map((challenge) => (
                    <Card key={challenge.id} className={!challenge.is_active ? 'opacity-50' : ''}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center space-x-4">
                               <Trophy className="w-8 h-8 text-yellow-500" />
                                <div>
                                    <CardTitle>{challenge.name} {challenge.is_active ? '' : '(Inactive)'}</CardTitle>
                                    <CardDescription>{challenge.type} - Target: {challenge.target}</CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(challenge)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(challenge.id)} disabled={deleteMutation.isPending}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p>{challenge.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
