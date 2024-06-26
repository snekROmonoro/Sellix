// Dependencies
import { Got } from "got"
import { IOrder, IOrderGetResponse, IOrderListResponse } from "../Interfaces/IOrder.js"
import { SellixBase } from "../Interfaces/SellixBase.js"
import { HttpClient } from "../index.js"

//
export interface Order extends IOrder { }
export class Order {
    // Vars
    HttpClient: Got

    // Constructor
    constructor(Data: IOrder) {
        Object.assign(this, Data)

        this.HttpClient = HttpClient.extend({
            headers: {
                Authorization: `Bearer ${this.api_key}`,
                "X-Sellix-Merchant": this.merchant
            }
        })
    }

    // Retrieves an Order by Uniqid.
    static async getByID(api_key: string, id: string, merchant?: string) {
        // Convert
        const response: SellixBase<IOrderGetResponse> = await HttpClient.get(`orders/${id}`, {
            headers: {
                Authorization: `Bearer ${api_key}`,
                "X-Sellix-Merchant": merchant
            }
        }).json()

        if (response.error) {
            throw new Error(response.error)
        }

        const order = new Order(response.data.order)

        //
        return order
    }
    async getByID(id: string) {
        return await Order.getByID(this.api_key, id)
    }

    // Merged get
    static async get(api_key: string, param?: string | number, merchant?: string) {
        if (typeof param == "string")
            return await Order.getByID(api_key, param, merchant)
        else
            return await Order.getAll(api_key, param, merchant)
    }
    async get(param: string | number) {
        return Order.get(this.api_key, param, this.merchant)
    }

    // Returns a list of all the Order. The order are sorted by creation date, with the most recently created order being first. Product objects and additional info are not shown in the list endpoint.
    static async getAll(api_key: string, page?: number, merchant?: string) {
        // Get the orders
        const response: SellixBase<IOrderListResponse> = await HttpClient.get("orders", {
            searchParams: { page: page },
            headers: {
                Authorization: `Bearer ${api_key}`,
                "X-Sellix-Merchant": merchant
            }
        }).json()

        if (response.error) {
            throw new Error(response.error)
        }

        // Convert each object to a order object
        let orders = []
        for (const _order of response.data.orders) {
            orders.push(new Order(_order))
        }

        //
        return orders
    }
    async getAll(page?: number) {
        return await Order.getAll(this.api_key, page)
    }
}