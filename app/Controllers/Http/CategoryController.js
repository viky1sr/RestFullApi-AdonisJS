'use strict'

const Category = use('App/Models/Category')
const { validate } = use('Validator')


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with categories
 */
class CategoryController {
  /**
   * Show a list of all categories.
   * GET categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view,auth }) {
    let data = await Category.query().with('user').fetch()
    return response.json({
      data: data,
      status: 200,
    });
    // const user = await auth.getUser();
    //
    // return await user.category().fetch();

  }

  async indexByUser ({params, view,auth }) {
    const {id} = params;
    const user = await auth.getUser(id);

    return await user.category().fetch();

  }

  /**
   * Render a form to be used for creating a new category.
   * GET categories/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new category.
   * POST categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const data = request.all();

    const msg = {
      'name.required': 'Please add your name',
      'stock.required': 'Please add a stock',
      'price.required': 'Please add a price',
      'tpye.required': 'Please add a type'
    }

    const validation = await validate(data,{
      name: 'required',
      stock: 'required',
      price: 'required',
      type: 'required'
    },msg);

    if (validation.fails()) {
      return validation.messages()
    }

    const input = {
      user_id: data.user_id,
      name: data.name,
      stock: data.stock,
      price: data.price,
      type: data.type,
    }

    await Category.create(input);

    return response.json({
      messages: 'Berhasil membuat data',
      status: 200,
    });
  }

  /**
   * Display a single category.
   * GET categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view, auth }) {
    const user = await auth.getUser();
    const {id} = params;
    const category = await Category.find(id);

    if(category.user_id !== user.id) {
      return response.status(403).json({
        messages: "Data not found"
      });
    }else if(category.user_id == false || category.id == false) {
      return response.status(404).json({
        messages: "Data not found!"
      });
    }

    return await category;
  }

  /**
   * Render a form to update an existing category.
   * GET categories/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update category details.
   * PUT or PATCH categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const data = request.all();

    const {id} = params;

    const msg = {
      'name.required': 'Please add your name',
      'stock.required': 'Please add a stock',
      'price.required': 'Please add a price',
      'tpye.required': 'Please add a type'
    }

    const validation = await validate(data,{
      name: 'required',
      stock: 'required',
      price: 'required',
      type: 'required'
    },msg);

    if (validation.fails()) {
      return validation.messages()
    }

    const category = await Category.findOrFail(id);

    const input = [
      category.name = data.name,
      category.stock = data.stock,
      category.price = data.price,
      category.type = data.type,
      category.save()
    ]

    return response.json({
      messages: category,
      status: 200,
    });
  }

  /**
   * Delete a category with id.
   * DELETE categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response, auth }) {
    const user = await auth.getUser();
    const {id} = params;
    const category = await Category.find(id);

    if(category.user_id !== user.id) {
      return response.status(403).json({
        messages: "Data not found"
      });
    }else if(category.user_id == false || category.id == false) {
      return response.status(404).json({
        messages: "Data not found!"
      });
    }

    await category.delete();
    return response.status(200).json({
      messages: "Successfully deleted category"
    })
  }

}

module.exports = CategoryController
