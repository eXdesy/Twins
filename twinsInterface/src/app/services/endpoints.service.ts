import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EndpointsService {
  constructor(private http: HttpClient) { }
  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

	report(report_type_id: number, report_type: string, report_category: string, description: string, report_status: string, token: string): Observable<any> {
    const report = {
      report_type_id: report_type_id,
      report_type: report_type,
      report_category: report_category,
      description: description,
      report_status: report_status
    };
    return this.http.post<any>(`${environment.apiUrl}/user/report`, report, { headers: this.getHeaders(token) });
  }

  updateProfile(first_name: string, last_name: string, country: string, country_iso: string, city_iso: string, city: string, birthday: string, orientation: string, description: string, foto: string, token: string): Observable<any> {
    const updateProfile = {
      first_name: first_name,
      last_name: last_name,
      orientation: orientation,
      country: country,
      country_iso: country_iso,
      city: city,
      city_iso: city_iso,
      date_of_birth: birthday,
      description: description,
      foto: foto
    };
    return this.http.put<any>(`${environment.apiUrl}/user/updateProfile`, updateProfile, { headers: this.getHeaders(token) });
  }
  getProfile(token: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user/getProfile`, { headers: this.getHeaders(token) });
  }
  getProfiles(profile_id: number, token: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user/getProfiles/${profile_id}`, { headers: this.getHeaders(token) });
  }
	
  updateNetwork(instagram: string, snapchat: string, twitter: string, vk: string, discord: string, tiktok: string, twitch: string, bereal: string, token: string) {
    const updateNetwork = {
      instagram: instagram,
      snapchat: snapchat,
      twitter: twitter,
      vk: vk,
      discord: discord,
      tiktok: tiktok,
      twitch: twitch,
      bereal: bereal
    };
    return this.http.put<any>(`${environment.apiUrl}/user/updateNetwork`, updateNetwork, { headers: this.getHeaders(token) });
  }
  getNetwork(token: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user/getNetwork`, { headers: this.getHeaders(token) });
  }
  getNetworks(profile_id: number, token: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user/getNetworks/${profile_id}`, { headers: this.getHeaders(token) });
  }
	
  getAllChannels(token: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user/getAllChannels`, { headers: this.getHeaders(token) });
  }
  searchChannels(name: string, token: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user/searchChannels/${name}`, { headers: this.getHeaders(token) });
  }
	getAllChannelsCountry(country: string, token: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user/getAllChannelsCountry/${country}`, { headers: this.getHeaders(token) });
  }
	getAllChannelsCategory(selectedCategories: string[], token: string): Observable<any> {
		return this.http.get<any>(`${environment.apiUrl}/user/getAllChannelsCategory/`, { headers: this.getHeaders(token), params: { categories: selectedCategories } });
	}
  createChannel(foto: string, name: string, category: string, description: string, country: string, country_iso: string, price: string, link: string, token: string): Observable<any> {
    const createChannel = {
      foto: foto,
      name: name,
      category: category,
      description: description,
      country: country,
      country_iso: country_iso,
      price: 0,
      link: link
    };
    return this.http.post<any>(`${environment.apiUrl}/user/createChannel`, createChannel, { headers: this.getHeaders(token) });
  }
  updateChannel(channel_id: number, foto: string, name: string, category: string, description: string, country: string, country_iso: string, price: string, link: string, token: string): Observable<any> {
    const updateChannel = {
      channel_id: channel_id,
      foto: foto,
      name: name,
      category: category,
      description: description,
      country: country,
      country_iso: country_iso,
      price: price,
      link: link
    };
    return this.http.put<any>(`${environment.apiUrl}/user/updateChannel`, updateChannel, { headers: this.getHeaders(token) });
  }
  getChannel(token: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user/getChannel`, { headers: this.getHeaders(token) });
  }
  deleteChannel(channel_id: number, token: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/user/deleteChannel/${channel_id}`, { headers: this.getHeaders(token) });
  }
  joinChannel(channel_id: number, status: string, token: string): Observable<any> {
    const joinChannel = {
      channel_id: channel_id,
      status: status
    };
    return this.http.post<any>(`${environment.apiUrl}/user/joinChannel`, joinChannel, { headers: this.getHeaders(token) });
  }
  getJoinedChannel(token: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user/getJoinedChannel`, { headers: this.getHeaders(token) });
  } 
  deleteJoinedGroup(channel_id: number, token: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/user/deleteJoinedGroup/${channel_id}`, { headers: this.getHeaders(token) });
  }

  getAllGroups(token: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user/getAllGroups`, { headers: this.getHeaders(token) });
  }
  searchGroups(name: string, token: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user/searchGroups/${name}`, { headers: this.getHeaders(token) });
  }
	getAllGroupsCountry(country: string, token: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user/getAllGroupsCountry/${country}`, { headers: this.getHeaders(token) });
  }
	getAllGroupsCategory(selectedCategories: string[], token: string): Observable<any> {
		return this.http.get<any>(`${environment.apiUrl}/user/getAllGroupsCategory/`, { headers: this.getHeaders(token), params: { categories: selectedCategories } });
	}
  createGroup(foto: string, name: string, category: string, description: string, country: string, country_iso: string, price: string, link: string, token: string): Observable<any> {
    const createChannel = {
      foto: foto,
      name: name,
      category: category,
      description: description,
      country: country,
      country_iso: country_iso,
      price: 0,
      link: link
    };
    return this.http.post<any>(`${environment.apiUrl}/user/createGroup`, createChannel, { headers: this.getHeaders(token) });
  }
  updateGroup(group_id: number, foto: string, name: string, category: string, description: string, country: string, country_iso: string, price: string, link: string, token: string): Observable<any> {
    const updateChannel = {
      group_id: group_id,
      foto: foto,
      name: name,
      category: category,
      description: description,
      country: country,
      country_iso: country_iso,
      price: price,
      link: link
    };
    return this.http.put<any>(`${environment.apiUrl}/user/updateGroup`, updateChannel, { headers: this.getHeaders(token) });
  }
  getGroup(token: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user/getGroup`, { headers: this.getHeaders(token) });
  }
  deleteGroup(group_id: number, token: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/user/deleteGroup/${group_id}`, { headers: this.getHeaders(token) });
  }
  joinGroup(group_id: number, status: string, token: string): Observable<any> {
    const joinGroup = {
      group_id: group_id,
      status: status
    };
    return this.http.post<any>(`${environment.apiUrl}/user/joinGroup`, joinGroup, { headers: this.getHeaders(token) });
  }
  getJoinedGroups(token: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user/getJoinedGroups`, { headers: this.getHeaders(token) });
  }
  deleteJoinedChannel(group_id: number, token: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/user/deleteJoinedChannel/${group_id}`, { headers: this.getHeaders(token) });
  }

  getAllUsers(token: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user/getAllUsers`, { headers: this.getHeaders(token) });
  }
  getRandomUsers(token: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user/getRandomUsers`, { headers: this.getHeaders(token) });
  }
  searchUsers(username: string, token: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user/searchUsers/${username}`, { headers: this.getHeaders(token) });
  }
  likeUser(liked_profile_id: number, status: string, token: string): Observable<any> {
    const likeUser = {
      liked_profile_id: liked_profile_id,
      status: status
    };
    return this.http.post<any>(`${environment.apiUrl}/user/likeUser`, likeUser, { headers: this.getHeaders(token) });
  }
  getLikedUsers(token: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user/getLikedUsers`, { headers: this.getHeaders(token) });
  }
  unlikeUser(liked_profile_id: number, token: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/user/unlikeUser/${liked_profile_id}`, { headers: this.getHeaders(token) });
  }

  matchUser(match_profile_id: number, status: string, token: string): Observable<any> {
    const matchUser = {
      match_profile_id: match_profile_id,
      status: status
    };
    return this.http.post<any>(`${environment.apiUrl}/user/matchUser`, matchUser, { headers: this.getHeaders(token) });
  }
  getMatchedUsers(token: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user/getMatchedUsers`, { headers: this.getHeaders(token) });
  }
  unmatchUser(match_profile_id: number, token: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/user/unmatchUser/${match_profile_id}`, { headers: this.getHeaders(token) });
  }
}
