import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';
import { User, UserSkill, Request, Match, Transaction, Report, Notification, MyMission, GlobalMission, Donation } from './models';

const adapter = new SQLiteAdapter({
	schema,
	dbName: 'sanned_db',
	jsi: true,
	onSetUpError: error => {
		console.error('Database setup error:', error);
	}
});

export const database = new Database({
	adapter,
	modelClasses: [
		User,
		UserSkill,
		Request,
		Match,
		Transaction,
		Report,
		Notification,
		MyMission,
		GlobalMission,
		Donation,
	],
});

export const initializeDatabase = async () => {
	try {
		console.log('Initializing database...');
		const userCount = await database.get<User>('users').query().fetchCount();
		if (userCount === 0) {
			await seedDatabase();
		}
		console.log('Database initialized successfully');
	} catch (error) {
		console.error('Database initialization error:', error);
		throw error;
	}
};

const seedDatabase = async () => {
	try {
		console.log('Seeding database with initial data...');
		await database.write(async () => {
			const user1 = await database.get<User>('users').create(user => {
				user.name = 'John Doe';
				user.email = 'john@example.com';
				user.role = 'doer';
				user.location = 'Gaza, Palestine';
				user.isInGaza = true;
				user.bio = 'Helping my community through difficult times';
				user.isVerified = true;
				user.createdAt = new Date();
				user.updatedAt = new Date();
			});

			const user2 = await database.get<User>('users').create(user => {
				user.name = 'Sara Ahmed';
				user.email = 'sara@example.com';
				user.role = 'sponsor';
				user.location = 'Cairo, Egypt';
				user.isInGaza = false;
				user.bio = 'Supporting Gaza through donations and aid';
				user.isVerified = true;
				user.createdAt = new Date();
				user.updatedAt = new Date();
			});

			await database.get<UserSkill>('user_skills').create(skill => {
				skill.userId = user1.id;
				skill.skill = 'First Aid';
				skill.createdAt = new Date();
				skill.updatedAt = new Date();
			});

			await database.get<UserSkill>('user_skills').create(skill => {
				skill.userId = user1.id;
				skill.skill = 'Food Distribution';
				skill.createdAt = new Date();
				skill.updatedAt = new Date();
			});

			await database.get<Request>('requests').create(request => {
				request.userId = user1.id;
				request.type = 'donation';
				request.title = 'Emergency Food Supplies';
				request.description = 'Need food packages for families in northern Gaza';
				request.location = 'Gaza City';
				request.status = 'approved';
				request.createdAt = new Date();
				request.updatedAt = new Date();
			});

			await database.get<MyMission>('my_missions').create(mission => {
				mission.userId = user1.id;
				mission.title = 'Emergency Food Distribution';
				mission.description = 'Our children haven\'t eaten bread in two days, we need food urgently.';
				mission.location = 'Gaza City, North Gaza';
				mission.latitude = 31.5017;
				mission.longitude = 34.4668;
				mission.paymentType = 'Volunteer';
				mission.urgency = 'Urgent';
				mission.status = 'active';
				mission.skills = JSON.stringify(['Food Distribution', 'First Aid']);
				mission.bgImage = 'tent';
				mission.createdAt = new Date();
				mission.updatedAt = new Date();
			});

			await database.get<MyMission>('my_missions').create(mission => {
				mission.userId = user1.id;
				mission.title = 'Medical Supplies Needed';
				mission.description = 'My mother is sick and we can\'t find medicine for her fever.';
				mission.location = 'Rafah, Gaza';
				mission.latitude = 31.2996;
				mission.longitude = 34.2398;
				mission.paymentType = 'Paid';
				mission.amount = 50;
				mission.urgency = 'Soon';
				mission.status = 'active';
				mission.skills = JSON.stringify(['Medical Knowledge', 'Transportation']);
				mission.bgImage = 'tent';
				mission.createdAt = new Date();
				mission.updatedAt = new Date();
			});

			await database.get<GlobalMission>('global_missions').create(mission => {
				mission.serverId = 'global_1';
				mission.userId = 'global_user_1';
				mission.userName = 'International Aid Foundation';
				mission.userAvatar = 'https://example.com/aid_foundation_avatar.jpg';
				mission.title = 'Gaza Emergency Water Fund';
				mission.description = 'Clean water is critical for survival. Help us provide safe drinking water to families in Gaza who have been without access for weeks.';
				mission.location = 'Gaza Strip, Palestine';
				mission.latitude = 31.5017;
				mission.longitude = 34.4668;
				mission.paymentType = 'Sponsor';
				mission.amount = 100;
				mission.urgency = 'Urgent';
				mission.status = 'active';
				mission.skills = JSON.stringify(['Water Distribution', 'Community Outreach']);
				mission.bgImage = 'tent';
				mission.distanceKm = 0;
				mission.lastSyncAt = Date.now();
				mission.createdAt = new Date();
				mission.updatedAt = new Date();
			});

			await database.get<GlobalMission>('global_missions').create(mission => {
				mission.serverId = 'global_2';
				mission.userId = 'global_user_2';
				mission.userName = 'Gaza Children Relief';
				mission.userAvatar = 'https://example.com/children_relief_avatar.jpg';
				mission.title = 'Winter Warmth for Gaza Children';
				mission.description = 'Winter is coming and children in Gaza need warm clothing and blankets. Every donation helps keep a child warm through the cold nights.';
				mission.location = 'Khan Younis, Gaza';
				mission.latitude = 31.3469;
				mission.longitude = 34.3063;
				mission.paymentType = 'Sponsor';
				mission.amount = 75;
				mission.urgency = 'Soon';
				mission.status = 'active';
				mission.skills = JSON.stringify(['Distribution', 'Child Care']);
				mission.bgImage = 'scarf';
				mission.distanceKm = 0;
				mission.lastSyncAt = Date.now();
				mission.createdAt = new Date();
				mission.updatedAt = new Date();
			});

			await database.get<GlobalMission>('global_missions').create(mission => {
				mission.serverId = 'global_3';
				mission.userId = 'global_user_3';
				mission.userName = 'Gaza Medical Support';
				mission.userAvatar = 'https://example.com/medical_support_avatar.jpg';
				mission.title = 'Emergency Medical Supplies';
				mission.description = 'Hospitals in Gaza are running critically low on basic medical supplies. Your donation can help save lives by providing essential medical equipment.';
				mission.location = 'Gaza City, Gaza';
				mission.latitude = 31.5017;
				mission.longitude = 34.4668;
				mission.paymentType = 'Sponsor';
				mission.amount = 150;
				mission.urgency = 'Urgent';
				mission.status = 'active';
				mission.skills = JSON.stringify(['Medical Knowledge', 'Emergency Response']);
				mission.bgImage = 'tent';
				mission.distanceKm = 0;
				mission.lastSyncAt = Date.now();
				mission.createdAt = new Date();
				mission.updatedAt = new Date();
			});

			await database.get<MyMission>('my_missions').create(mission => {
				mission.userId = user2.id;
				mission.title = 'Winter Clothing Drive';
				mission.description = 'It is very cold at night, we need blankets for our kids.';
				mission.location = 'Khan Younis, Gaza';
				mission.latitude = 31.3469;
				mission.longitude = 34.3063;
				mission.paymentType = 'Sponsor';
				mission.amount = 200;
				mission.urgency = 'Flexible';
				mission.status = 'matched';
				mission.skills = JSON.stringify(['Distribution', 'Organization']);
				mission.bgImage = 'tent';
				mission.createdAt = new Date();
				mission.updatedAt = new Date();
			});

			await database.get<Notification>('notifications').create(notification => {
				notification.userId = user1.id;
				notification.type = 'mission';
				notification.title = 'Mission Accepted';
				notification.message = 'Your mission *Food Delivery* has been accepted.';
				notification.isRead = false;
				notification.icon = 'checkmark-circle-outline';
				notification.color = '#4a8a28';
				notification.createdAt = new Date();
				notification.updatedAt = new Date();
			});

			await database.get<Notification>('notifications').create(notification => {
				notification.userId = user1.id;
				notification.type = 'reminder';
				notification.title = 'Mission Reminder';
				notification.message = 'Don\'t forget: Mission *Baby Milk* starts at 5 PM.';
				notification.isRead = false;
				notification.icon = 'alarm-outline';
				notification.color = '#f59e0b';
				notification.createdAt = new Date();
				notification.updatedAt = new Date();
			});

			await database.get<Notification>('notifications').create(notification => {
				notification.userId = user1.id;
				notification.type = 'match';
				notification.title = 'New Match Found';
				notification.message = 'We found a match for your mission *Blankets Needed*.';
				notification.isRead = false;
				notification.icon = 'heart-outline';
				notification.color = '#ef4444';
				notification.createdAt = new Date();
				notification.updatedAt = new Date();
			});
		});
		console.log('Database seeded successfully');
	} catch (error) {
		console.error('Database seeding error:', error);
		throw error;
	}
};

export default database;