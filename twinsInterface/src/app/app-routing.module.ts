import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SupportComponent } from './support/support.component';
import { AuthComponent } from './auth/auth.component';
import { CheckComponent } from './check/check.component';
import { MainComponent } from './home/main/main.component';
import { FiltersComponent } from './filters/filters.component';
import { SavesComponent } from './home/saves/saves.component';
import { SearchComponent } from './home/search/search.component';
import { NotificationComponent } from './home/notification/notification.component';
import { SettingsComponent } from './home/settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { PasswordComponent } from './password/password.component';
import { NetworksComponent } from './networks/networks.component';
import { ChannelsComponent } from './channels/channels.component';
import { UpdateChannelComponent } from './channels/updateChannel/updateChannel.component';
import { CreateChannelComponent } from './channels/createChannel/createChannel.component';
import { GroupsComponent } from './groups/groups.component';
import { UpdateGroupComponent } from './groups/updateGroup/updateGroup.component';
import { CreateGroupComponent } from './groups/createGroup/createGroup.component';
import { ProfileInfoComponent } from './profile-info/profile-info.component';

const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'login', component: AuthComponent },
  { path: 'check', component: CheckComponent },
  { path: 'support', component: SupportComponent },
  { path: 'filters', component: FiltersComponent },
  { path: 'home', component: HomeComponent, children: [
		{ path: 'saves', component: SavesComponent },
		{ path: 'main', component: MainComponent },
		{ path: 'search', component: SearchComponent },
		{ path: 'notification', component: NotificationComponent },
		{ path: 'settings', component: SettingsComponent },
	]},
	{ path: 'profile', component: ProfileComponent },
	{ path: 'profileInfo', component: ProfileInfoComponent },
	{ path: 'networks', component: NetworksComponent },
	{ path: 'password', component: PasswordComponent },
	{ path: 'support', component: SupportComponent },
	{ path: 'channels', component: ChannelsComponent},
	{ path: 'updateChannel', component: UpdateChannelComponent },
	{ path: 'createChannel', component: CreateChannelComponent },			
	{ path: 'groups', component: GroupsComponent },
	{ path: 'updateGroup', component: UpdateGroupComponent },
	{ path: 'createGroup', component: CreateGroupComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule,
    FormsModule 
  ]
})
export class AppRoutingModule { }
