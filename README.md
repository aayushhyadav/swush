<!-- https://cdn.dribbble.com/users/240981/screenshots/2329287/swush.jpg -->
<img src="./img/banner.png" alt="swush" width="1000">

<h2 align="center">A secure vault for teams</h2>

The master password is the common weak point of many password managers. In a developer circle, where team members keep joining and
leaving projects, it can become cumbersome for the remaining team members to memorize the new master password after any member leaves.

Swush leverages the concept of dynamic public keyrings, where the secret is encrypted with the public key of all team members and
decrypted using the member’s private key. Every time a new member joins the team, his/her public key is added to the keyring, and
all secrets are re-encrypted with the updated public keyring. Whenever a member leaves the team, his/her public key is removed from
the keyring.

<h4>Features offered by Swush</h4>

- Users can create teams for storing confidential information like SSH keys, Passwords, OAuth tokens, and Files (currently supports only text and image files) for their projects.
- Admins can add or remove team members.
- Users can manage secrets by updating or deleting existing ones and adding new ones.
- All secret information is encrypted using the public keys of all team members and stored in the team vault.
- The information is decrypted using the private key of the user.

Link to the [Demo Video](https://coepac-my.sharepoint.com/:v:/g/personal/correasn18_comp_coep_ac_in/Eai2vgXbFm1MjDmhDnNiH3QBEVFXASAcCudnbHIhXyofxw?e=d1SVgs).
