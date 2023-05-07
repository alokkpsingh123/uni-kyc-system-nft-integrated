import {
  Box,
  Button,
  Center,
  FormControl,
  Heading,
  HStack,
  Input,
  Spinner,
  Text,
  TextArea,
  VStack,
} from "native-base";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../../components";
import { ScreenHeader } from "../../../components/screen-header";
import { useAuthContext } from "../../../contexts/auth-context";
import { useApi } from "../../../hooks/useApi";
import { Customer, KycServices } from "../../../repository";
import { toastError, toastSuccess } from "../../../utils";
import { setSourceMapRange } from "typescript";

declare global {
  interface Window {
    ethereum?: any;
  }
}


type UserDetails = {
  name: string;
  email: string;
  mobileNumber: string;
  id_: string;
};

export function AddPage() {
  // const Web3 = require('web3');
  // const abi = require('C:\\Users\\alokk\\Desktop\\Learning\\learning blockchain\\kyc2\\front-end\\src\\contracts\\KYC.json');
  // const web3 = new Web3(window.ethereum);
  // const contract = new web3.eth.Contract(abi, '0x10458deDD54310640eC61376BC9a85BDdF52650B');
  // console.log("contract");
  // console.log(contract);
  // console.log(web3.eth.getBlockNumber());

  
  
  const [userDetails, setUserDetails] = useState<UserDetails>(
    {} as UserDetails
  );
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [msg,setMsg]=useState(false);
  let navigate = useNavigate();

  

  const { addKycRequest, getAllBankCustomerList, getcheckAddress,setaddAddress } = useApi();
  const {
    state: { pageNo },
  } = useAuthContext();
  function validate() {
    const re = /^0x[a-fA-F0-9]{40}$/;
    if (!userDetails.name) {
      toastError("Name is required");
      return false;
    } else if (!userDetails.email.includes("@") || !userDetails.email) {
      toastError("Email is invalid");
      return false;
    } else if (
      userDetails.mobileNumber.length < 10 ||
      userDetails.mobileNumber.length > 10
    ) {
      toastError("Invalid phone no");
      return false;
    } else if (!re.test(userDetails.id_)) {
      toastError("Invalid metamask address");
      return false;
    }
    return true;
  }
  const Text1=()=><Text>KYC of the user is done</Text>
  async function checkmask(){
    console.log(userDetails);
    console.log(userDetails.id_);

    if(await getcheckAddress(userDetails.id_)){
      setMsg(true);
    }else{
      await setaddAddress(userDetails.id_);
    }
  
    // var meta:string=userDetails.id_;
    // if(userDetails && userDetails.id_ && userDetails.id_.length === 41)
    // {
    //   //call backend to verify mask is present or not
    //   //if present return true else false
    //   setMsg(true);
    // }
    
  }
  async function addCustomer() {
    try {
      if (validate()) {
        setLoading(true);
        const time = Math.floor(new Date().getTime() / 1000.0);
        const customer: Customer = {
          ...userDetails,
          kycVerifiedBy: "0x0000000000000000000000000000000000000000",
          dataHash: "",
          dataUpdatedOn: 0,
        };
        const data = { customer, time, notes };
        await addKycRequest(data);
        // listenToEvent();
        setUserDetails({ email: "", mobileNumber: "", name: "", id_: "" });   
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const listenToEvent = async () => {
    KycServices.eventContract.on("CustomerAdded", async (id_, name, email) => {
      console.log("event", name);
      await getAllBankCustomerList(1);
      toastSuccess("Bank added successfully");
    });
  };

  return (
    <Layout>
      <Center mt={["3", "16"]}>
        <Box mt={["5", "0"]} w={["90vw", "40vw"]}>
          <Heading color={"white"} mb="4" alignSelf={"flex-start"}>
            Request For KYC
          </Heading>
          <VStack bg="white" minH="50vh" borderRadius={10} p="10" space={5}>
            <ScreenHeader text={"Back"} route="/dashboard" />
            <FormControl w={["100%", "100%"]}>
              <FormControl.Label>
                <Text>Customer Name</Text>
              </FormControl.Label>
              <Input
                onChangeText={(text) =>
                  setUserDetails((curr) => ({ ...curr, name: text }))
                }
                value={userDetails.name}
                placeholder="John Doe"
                color="blueGray.900"
                borderColor={"blueGray.900"}
              />
            </FormControl>
            <FormControl w={["100%", "100%"]}>
              <FormControl.Label>
                <Text>Customer Email</Text>
              </FormControl.Label>
              <Input
                onChangeText={(text) =>
                  setUserDetails((curr) => ({ ...curr, email: text }))
                }
                value={userDetails.email}
                placeholder="john@geekyants.com"
                color="blueGray.900"
                borderColor={"blueGray.900"}
              />
            </FormControl>
            <FormControl w={["100%", "100%"]}>
              <FormControl.Label>
                <Text>Customer Phone</Text>
              </FormControl.Label>
              <Input
                onChangeText={(text) =>
                  setUserDetails((curr) => ({ ...curr, mobileNumber: text }))
                }
                value={userDetails.mobileNumber}
                placeholder="9897003112"
                color="blueGray.900"
                borderColor={"blueGray.900"}
              />
            </FormControl>
            <FormControl w={["100%", "100%"]}>
              <FormControl.Label>
                <Text>Metamask Address</Text>
              </FormControl.Label>
              <Input
                onChangeText={(text) => {
                  setUserDetails((curr) => ({ ...curr, id_: text }));
                  checkmask();
                }}
                value={userDetails.id_}
                placeholder="0x2D8706E94E187c4E1806a8F5b4cxas5137460784D"
                color="blueGray.900"
                borderColor={"blueGray.900"}
              />
              {msg && <Text1/>}
             
            </FormControl>
            <FormControl w={["100%", "100%"]}>
              <FormControl.Label>
                <Text>Notes</Text>
              </FormControl.Label>
              <TextArea
                onChangeText={(text) => setNotes(text)}
                value={notes}
                placeholder="Enter notes"
                color="blueGray.900"
                borderColor={"blueGray.900"}
              />
            </FormControl>
            {loading ? (
              <Button
                size="lg"
                mt="5"
                w="60%"
                borderWidth={2}
                isDisabled={true}
                variant={"outline"}
                alignSelf={"center"}
              >
                <HStack>
                  <Text mr="2">Requesting</Text>
                  <Spinner accessibilityLabel="Loading posts" />
                </HStack>
              </Button>
            ) : (
              <Button
                size="lg"
                mt="5"
                w="60%"
                onPress={() => addCustomer()}
                cursor={"pointer"}
                borderWidth={2}
                variant={"outline"}
                alignSelf={"center"}
              >
                Request For KYC
              </Button>
            )}
          </VStack>
        </Box>
      </Center>
    </Layout>
  );
}
