import React from 'react'
import { Spinner, Heading } from 'evergreen-ui'
import Box from 'ui-box'


export const Loading = () => {
    return (
       <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
           <Spinner />
           <Heading color="#1070CA" marginTop="1rem" size={600} textAlign="center">Loading...</Heading>
       </Box>
    )
}
