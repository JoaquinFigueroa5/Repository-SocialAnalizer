import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { social_analyzer } from "../../services/api";

const useSocialAnalizer = () => {
    const [metadata, setMetada] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toast = useToast();

    const fetchMetadata = async(data) => {
        setLoading(true);
        try {
            // console.log(data);
            
            const response = await social_analyzer(data);
            // console.log(response.data.detected)

            if (response.error) {
                // setError(response.msg);
                throw new Error(response.msg);              
            }

            // toast({
            //     title: "Informacion obtenida",
            //     description: "Informacion recolectada correctamente.",
            //     status: "success",
            //     duration: 3000,
            //     isClosable: true,
            //     position: "top-right",
            // });

            return response
        } catch (error) {            
            setError(error.response?.data?.msg || error.response?.data?.error || 'Error loading metadata')
        } finally {
            setLoading(false);
        }
    }

    return { metadata, fetchMetadata, loading, error}
};

export default useSocialAnalizer;