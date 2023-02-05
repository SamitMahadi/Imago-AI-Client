import React from 'react';
import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { preview } from '../assets'
import { FormField, Loader } from '../components'
import { getRandomPrompt } from '../utils'


const CreatePost = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        prompt: '',
        photo: '',
    })
    const [generatingImg, setgeneratingImg] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {

        setForm({ ...form, [e.target.name]: e.target.value })

    }
  

    const generateImage = async () => {
        if (form.prompt) {
            try {
                setgeneratingImg(true)
                const response = await fetch('http://localhost:5000/api/v1/imago', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt: form.prompt })
                })


                const data = await response.json();

                setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` })


            } catch (error) {

                alert(error);

            } finally {
                setgeneratingImg(false);
            }
        } else {
            alert('please enter a prompt')
        }
    }



  
    
    const handleSurpriseMe = () => {

        const randomPrompt = getRandomPrompt(form.prompt)
        setForm({ ...form, prompt: randomPrompt })

    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (form.prompt && form.photo) {
            setLoading(true)
            try {
                const response = await fetch('http://localhost:5000/api/v1/post', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(form)
                })

                await response.json();
                
                navigate('/')

            } catch (err) {
                alert(err)
            } finally {
                setLoading(false)
            }
        } else {
            alert('please enter a prompt and generate an image')
        }
    }
   

    return (
        <section className='max-w-7xl mx-auto'>
            <div>
                <h1 className='font-extrabold text-[#222328] text-[32px]'>Create</h1>
                <p className='mt-2 text-[#666e75] text-[16px] max-w-[800px]'>Create imaginative and visually stunning images through Imago AI & share them with community</p>
            </div>

            <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-5'>
                    <FormField
                        labelName='Your Name'
                        type='text'
                        name='name'
                        placeholder='John Doe'
                        value={form.name}
                        handleChange={handleChange}

                    ></FormField>

                    <FormField
                        labelName='Prompt'
                        type='text'
                        name='prompt'
                        placeholder='A hamburger in the shape of a Rubik’s cube, professional food photography'
                        value={form.prompt}
                        handleChange={handleChange}
                        isSurpriseMe
                        handleSurpriseMe={handleSurpriseMe}
                    ></FormField>

                    <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center'>
                        {form.photo ? (
                            <img src={form.photo} alt={form.prompt} className='w-full h-full object-contain' />
                        ) : (
                            <img src={preview} alt='preview' className='w-9/12 h-9/12 object-contain opacity-40' />
                        )}

                        {generatingImg && (
                            <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                                <Loader></Loader>
                            </div>
                        )}


                    </div>


                </div>
                <div className='mt-5 flex gap-5'>
                    <button type='button' onClick={generateImage} className="w-full text-white bg-green-700 font-medium rounded-md text-sm  px-5 py-2.5 text-center">
                        {generatingImg ? 'Generating....' : 'Generate'}
                    </button>
                </div>
                <div className='mt-10'>
                    <p className=' mt-2 text-[#666e75]'>
                        Once you have created the image you want , you can share with the community
                    </p>
                    <button type='submit' className=' mt-3 w-full text-white bg-[#6469ff] font-medium rounded-md text-sm  px-5 py-2.5 text-center' >
                        {loading ? 'Shareing...' : 'Share with the Community'}
                    </button>

                </div>


            </form>
        </section>
    );
};

export default CreatePost;