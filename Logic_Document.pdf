How I Implemented Smart Assign
I built a Smart Assign feature to automatically assign a task to the user who has the least workload at the moment.
The logic behind it is simple:
•	I fetch all users from the database.
•	For each user, I count how many tasks they currently have that are not marked as "Done".
•	I identify the user with the least number of active tasks.
•	Then, I assign the new task to that user and save it.
This approach helps distribute tasks fairly and efficiently, ensuring that no single user is overloaded while others are idle.
________________________________________

 How Conflict Handling Works
Conflict handling is necessary when multiple users might edit the same task at the same time.
 Problem:
If User A and User B both open the same task:
•	A edits and saves the task first.
•	Then B also tries to save their version — but their data is outdated.
This leads to a conflict, because the server’s version has changed since B last saw it.
________________________________________
 How I Detect Conflicts
Each task has an updatedAt timestamp.
When a user tries to update a task, they also send the version's timestamp they edited.
Before saving, I check:
•	If the timestamp in their request matches the latest updatedAt in the database.
If not, I block the update and return a 409 Conflict response, along with the latest server version of the task.
________________________________________
 Example:
User A:
•	Sees task titled “Fix login bug”
•	Changes it to “Fix login bug ASAP”
•	Saves → task is updated and updatedAt is changed
User B (who opened it earlier):
•	Changes the title to “Fix login issue on mobile”
•	Tries to save → Conflict detected, because updatedAt has changed
The app now gives B two choices:
________________________________________
 Conflict Resolution Options
1.	Overwrite
B can choose to overwrite the server’s version with their own version.

2.	Merge
B can choose to merge their changes with the server’s version.
I merge fields intelligently for text fields like title/description, I combine both.
For dropdown-like fields (status, priority), I prioritize the latest local change.
Once merged or overwritten, the task is saved and broadcast to all users in real-time.

