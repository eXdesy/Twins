import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SwitchService {
  $modal = new EventEmitter<boolean>();
  $modal2 = new EventEmitter<boolean>();
  $modal3 = new EventEmitter<boolean>();
  $modal4 = new EventEmitter<boolean>();
	$modalProfile = new EventEmitter<number>();
	$modalMessage = new EventEmitter<string>();
	$modalFilter = new EventEmitter<string>();
	$modalDetails = new EventEmitter<string>();
	$modalReportTypeID = new EventEmitter<number>();
	$modalReportType = new EventEmitter<string>();
	$groupData = new EventEmitter<any>();
  $channelData = new EventEmitter<any>();

	openCheckModal(message: string, details: string, value: boolean) {
		this.$modalMessage.emit(message);
		this.$modalDetails.emit(details);
		this.$modal.emit(value);
  }
  closeCheckModal() {
    this.$modal.emit(false);
  }

	openFilterModal(message: string, value: boolean) {
		this.$modalFilter.emit(message);
		this.$modal2.emit(value);
  }
  closeFilterModal() {
    this.$modal2.emit(false);
  }

	openProfileInfo(message: string, id: number, value: boolean) {
		this.$modalFilter.emit(message);
		this.$modalProfile.emit(id);
		this.$modal3.emit(value);
	}
  closeProfileInfo() {
    this.$modal3.emit(false);
  }

	openReport(message: string, type: string, id: number, value: boolean) {
		this.$modalFilter.emit(message);
		this.$modalReportType.emit(type);
		this.$modalReportTypeID.emit(id);
		this.$modal4.emit(value);
	}
  closeReportModal() {
    this.$modal4.emit(false);
  }

	emitGroupData(data: any) {
    this.$groupData.emit(data);
  }
	emitChannelData(data: any) {
    this.$channelData.emit(data);
  }

}
