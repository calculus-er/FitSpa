import { ExerciseFormValidator } from '../exercises/formValidator';
import { PushupValidator } from '../exercises/pushup';
import { SquatValidator } from '../exercises/squat';
import { PlankValidator } from '../exercises/plank';
import { LungeValidator } from '../exercises/lunge';

export interface Exercise {
  id: string;
  name: string;
  target: number;
  validator: ExerciseFormValidator;
}

export const exercises: Exercise[] = [
  {
    id: 'pushup',
    name: 'Push-ups',
    target: 20,
    validator: new PushupValidator(),
  },
  {
    id: 'squat',
    name: 'Squats',
    target: 30,
    validator: new SquatValidator(),
  },
  {
    id: 'plank',
    name: 'Plank Hold',
    target: 60, // seconds
    validator: new PlankValidator(),
  },
  {
    id: 'lunges',
    name: 'Lunges',
    target: 24,
    validator: new LungeValidator(),
  },
];

export const getExerciseById = (id: string): Exercise | undefined => {
  return exercises.find((ex) => ex.id === id);
};

