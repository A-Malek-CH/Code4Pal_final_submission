import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase";
import {
	UserInputPayload,
	DbResultPayload,
} from "@/providers/game-result-provider";
import { toast } from "sonner";

// The combined result from the server: points, win status, and achievements
interface GameSubmissionResult extends DbResultPayload {
	newly_unlocked_achievements: any[];
	total_xp_gained: number;
}

const submitGameResult = async (
	userInput: UserInputPayload
): Promise<GameSubmissionResult> => {
	// The RPC function now only needs the user_id and the payload of user input
	const { data, error } = await supabase.rpc(
		"handle_game_result_and_check_achievements",
		{
			p_user_id: userInput.user_id,
			p_user_input_payload: userInput,
		}
	);

	if (error) {
		console.error("Supabase RPC Error:", error);
		throw new Error(error.message || "Failed to submit game result.");
	}

	return data as GameSubmissionResult;
};

export const useSubmitGameResult = () => {
	return useMutation<GameSubmissionResult, Error, UserInputPayload>({
		mutationFn: submitGameResult,
		onError: (error) => {
			toast.error(error.message || "Could not save your score.");
		},
	});
};
