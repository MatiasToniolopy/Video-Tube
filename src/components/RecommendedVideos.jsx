import React, { useEffect, useState } from 'react'
import { Box, SimpleGrid } from '@chakra-ui/react'
import { getAllFeeds } from '../utils/fetchDara'
import Spinner from './Spinner'
import VideoPin from './VideoPin'

const RecommendedVideos = ({feeds}) => {
  return (
    <SimpleGrid
      minChildWidth="300px"
      spacing="15px"
      width="full"
      autoColumns={"max-content"}
      px="2"
      overflow={"hidden"}
    >
      {feeds &&
        feeds.map((data) => (
          <VideoPin key={data.id} maxWidth={420} height="80px" data={data} />
        ))}
    </SimpleGrid>
  );
}

export default RecommendedVideos