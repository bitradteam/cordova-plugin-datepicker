

declare namespace DatePicker {

    export enum ANDROID_THEMES {
        THEME_STYLED = 0,
        THEME_TRADITIONAL = 1, // default
        THEME_HOLO_DARK = 2,
        THEME_HOLO_LIGHT = 3,
        THEME_DEVICE_DEFAULT_DARK = 4,
        THEME_DEVICE_DEFAULT_LIGHT = 5
    }

    export enum UIPopoverArrowDirection {
        up = 1,
        down = 2,
        left = 4,
        right = 8,
        any = 15
    }

    export interface Options {
        mode?: string,
        date: Date,
        minDate?: Date,
        maxDate?: Date,
        minuteInterval?: number,

        // iOS
        allowOldDates?: boolean,
        allowFutureDates?: boolean,
        doneButtonLabel?: string,
        doneButtonColor?: string,
        cancelButtonLabel?: string,
        cancelButtonColor?: string,
        locale?: string,
        x?: string,
        y?: string,
        countDownDuration?: 0,
        popoverArrowDirection?: UIPopoverArrowDirection,

        // Android
        titleText?: string,
        cancelText?: string,
        okText?: string,
        todayText?: string,
        nowText?: string,
        is24Hour?: false,
        androidTheme?: ANDROID_THEMES
    }
    export interface datePickerCallbackFunction {
        (date: Date): void
    }

    export interface datePickerErrorCallbackFunction {
        (error: string): void
    }
}

declare namespace datePicker {

    export function show(options: DatePicker.Options, callback: DatePicker.datePickerCallbackFunction, errorCallback: DatePicker.datePickerErrorCallbackFunction): void;
}
