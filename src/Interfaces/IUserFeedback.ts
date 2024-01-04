// Interfaces
export interface IUserFeedback {
    api_key: string
    merchant?: string

    total: number
    positive: number
    neutral: number
    negative: number
}