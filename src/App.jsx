import { useState, useEffect } from 'react';
import md5 from 'md5';
import './App.scss';
import _jobs from './data/jobs.json';
import { JobsFull } from './components/JobsFull';
import { JobsList } from './components/JobsList';

_jobs.forEach((job) => {
	job.status = 'accepted';
});

const techItemsUrl = 'https://edwardtanguay.netlify.app/share/techItems.json';

const statuses = ['send', 'wait', 'interview', 'declined', 'accepted'];

function App() {
	const [displayKind, setDisplayKind] = useState('');
	const [jobs, setJobs] = useState([]);
	const [techItems, setTechItems] = useState([]);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [formLogin, setFormLogin] = useState('');
	const [formPassword, setFormPassword] = useState('');
	const [isFalseAttempt, setIsFalseAttempt] = useState(false);
	const [userGroup, setUserGroup] = useState('');

	const saveToLocalStorage = () => {
		if (displayKind !== '') {
			const jobAppState = {
				displayKind,
				jobs,
			};
			localStorage.setItem('jobAppState', JSON.stringify(jobAppState));
		}
	};

	const loadLocalStorage = () => {
		const jobAppState = JSON.parse(localStorage.getItem('jobAppState'));
		if (jobAppState === null) {
			setDisplayKind('list');
			setJobs(_jobs);
		} else {
			setDisplayKind(jobAppState.displayKind);
			setJobs(jobAppState.jobs);
		}
	};

	const loadTechItems = () => {
		(async () => {
			const response = await fetch(techItemsUrl);
			const data = await response.json();
			setTechItems(data);
		})();
	};

	useEffect(() => {
		loadLocalStorage();
		loadTechItems();
	}, []);

	useEffect(() => {
		saveToLocalStorage();
	}, [displayKind, jobs]);

	const handleToggleView = () => {
		const _displayKind = displayKind === 'full' ? 'list' : 'full';
		setDisplayKind(_displayKind);
	};

	const handleStatusChange = (job) => {
		let statusIndex = statuses.indexOf(job.status);
		statusIndex++;
		if (statusIndex > statuses.length - 1) {
			statusIndex = 0;
		}
		job.status = statuses[statusIndex];
		setJobs([...jobs]);
	};

	const handleSubmitButton = (e) => {
		e.preventDefault();
		if (
			formLogin === 'me' &&
			md5(formPassword) === '202cb962ac59075b964b07152d234b70'
		) {
			setUserGroup('fullAccessMembers');
			setIsLoggedIn(true);
			setIsFalseAttempt(false);
		} else if (
			formLogin === 'guest' &&
			md5(formPassword) === '900150983cd24fb0d6963f7d28e17f72'
		) {
			setIsLoggedIn(true);
			setIsFalseAttempt(false);
		} else {
			setIsFalseAttempt(true);
		}
	};
	const handleLogoutButton = () => {
		setFormLogin('');
		setFormPassword('');
		setIsLoggedIn(false);
		setUserGroup('');
	};

	return (
		<div className="App">
			<h1>Job Application Process</h1>
			{isLoggedIn ? (
				<>
					<div>There are {techItems.length} tech items.</div>
					<div className="buttonArea">
						{userGroup === 'fullAccessMembers' && (
							<button onClick={handleToggleView}>
								Toggle View
							</button>
						)}

						<button onClick={handleLogoutButton}>Log out</button>
					</div>
					{displayKind === 'full' ? (
						<JobsFull
							jobs={jobs}
							handleStatusChange={handleStatusChange}
							techItems={techItems}
						/>
					) : (
						<JobsList jobs={jobs} />
					)}
				</>
			) : (
				<>
					<form>
						<fieldset>
							<legend>Login</legend>
							<div className="messageOnForm">
								{isFalseAttempt && 'Please try again'}
							</div>
							<div className="row">
								<label htmlFor="login">Login</label>
								<input
									autoFocus
									type="text"
									id="login"
									value={formLogin}
									onChange={(e) => {
										setFormLogin(e.target.value);
									}}
								/>
							</div>
							<div className="row">
								<label htmlFor="password">Password</label>
								<input
									type="password"
									id="password"
									value={formPassword}
									onChange={(e) => {
										setFormPassword(e.target.value);
									}}
								/>
							</div>
							<div className="buttonRow">
								<button onClick={handleSubmitButton}>
									Enter
								</button>
							</div>
						</fieldset>
					</form>
				</>
			)}
		</div>
	);
}

export default App;
