# trivia-trainer-app-ball

The Trivia Trainer (TT) app is designed to help users sharpen their trivia knowledge, made with bar trivia in mind.
TT makes use of the Open Trivia DB API to serve questions to the user by category.

The app allows users to create an account and log in to save their lifetime quiz scores. These scores are kept by category and update at the end of each quiz. Quizzes that are stopped early will not count towards the lifetime score. To start, the user will select a trivia category from a dropdown menu. Tee categories are:

- Art
- History
- Science & Nature
- Sports
- Geography
- General Knowledge

After selecting a category, hitting the start button initiates the quiz. The quiz will contain 10 multiple choice questions from the selected category, and the app keeps track of the user's score, updating in the database upon quiz completion. 

!!!One you have completed your first quiz, you must hit refresh to get the lifetime score table to appear!!!
!!!Once you have refreshed and the table is created, it will update automatically after each quiz!!!