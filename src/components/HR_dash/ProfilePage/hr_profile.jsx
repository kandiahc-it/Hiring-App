import axios from 'axios';
import React, { useState } from 'react';
import './hr_profile.css';
const Hr_profile = () => {
    const [emails, setEmails] = useState('');
    const [passwords, setPasswords] = useState('');
    const [names, setNames] = useState('');
    const [allowedemails, setAllowedemails] = useState('');
    const [allemails, setAllemails] = useState([]);

    const handleSumbitHrDetails = (e) => {
        // Prevent page reload on form submission
        axios.post('http://localhost:5000/api/hr/register', {
            name: names,
            email: emails,
            password: passwords,
            allowedEmail: allemails
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        });
    };

    const handleAddEmail = (e) => {
        e.preventDefault();  // Prevent page reload on "Add" button click
        if (allowedemails ) {
            setAllemails([...allemails, allowedemails]);
            setAllowedemails('');  // Clear the input after adding
        }
    };

    return (
        <div className='profile__container'>
            <h1>HR Profile</h1>
            <div className="profile">
                <form className="profile__details" onSubmit={handleSumbitHrDetails}>
                    <h2>Profile Details</h2>
                    <div className="profile__details__input">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" name="name" placeholder="Your Name" onChange={(e) => setNames(e.target.value)} />
                    </div>
                    <div className="profile__details__input">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="Your Email" onChange={(e) => setEmails(e.target.value)} />
                    </div>
                    <div className="profile__details__input">
                        <label htmlFor="phone">Email Password</label>
                        <input type="password" id="password" name="password" placeholder="Your Email Password" onChange={(e) => setPasswords(e.target.value)} />
                    </div>
                    <div className='profile__details__input'>
                        <label htmlFor="allowedEmails">Allowed Emails</label>
                        <div className='allowed__emails'>
                            {allemails.map((email, index) => (
                                <div key={index}>{email}</div>
                            ))}
                        </div>
                        <input 
                            type="email" 
                            id="emailAllowed" 
                            name="email" 
                            placeholder="Allowed Emails" 
                            value={allowedemails}
                            onChange={(e) => setAllowedemails(e.target.value)} 
                        />
                        <button type="button" onClick={()=>{setAllemails([...allemails,allowedemails])}}>Add</button>
                    </div>
                    <button type="submit" className="profile__details__submit">Update</button>
                </form>
            </div>
        </div>
    );
};

export default Hr_profile;
