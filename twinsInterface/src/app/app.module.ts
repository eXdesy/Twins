import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { CheckComponent } from './check/check.component';
import { HttpClientModule } from '@angular/common/http';

import { SupportComponent } from './support/support.component';
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
import { FiltersComponent } from './filters/filters.component';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { HammerModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    CheckComponent,
    SupportComponent,
    SavesComponent,
    SearchComponent,
    NotificationComponent,
    SettingsComponent,
    ProfileComponent,
    PasswordComponent,
    NetworksComponent,
    ChannelsComponent,
    UpdateChannelComponent,
    CreateChannelComponent,
    GroupsComponent,
    UpdateGroupComponent,
    CreateGroupComponent,
    FiltersComponent,
    ProfileInfoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
		HammerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
