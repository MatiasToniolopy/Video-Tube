import { Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import Category from '../components/Category'
import { Route, Routes } from 'react-router-dom'
import Feed from '../components/Feed'
import Create from '../components/Create'
import VideoPin from '../components/VideoPin'
import Search from '../components/Search'
import {categories} from '../data'
import VideoPinDetail from '../components/VideoPinDetail'
import UserProfile from '../components/UserProfile'

const Home = ({user}) => {
  return (
    <>
    <NavBar user={user} />

    <Flex width={"100vw"}>
    <Flex direction={"column"} justifyContent="start" alignItems={"center"} width="5%">
      {categories && categories.map(data => <Category key={data.id} data={data} />)}
    </Flex>

    <Flex width={"95%"} px={4} justifyContent="center" alignItems={"center"}>
      <Routes>
        <Route path="/" element={<Feed />}/>
        <Route path="/category/:categoryId" element={<Feed />}/>
        <Route path="/create" element={<Create />}/>
        <Route path="/videoDetail/:videoId" element={<VideoPinDetail />}/>
        <Route path="/search" element={<Search />}/>
        <Route path="/userDetail/:userId" element={<UserProfile />}/>
      </Routes>
    </Flex>
    </Flex>
    </>
  )
}

export default Home