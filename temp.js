
const asyncHandler = (fun) => {
    return async () => {
        try {
            await fun();
            //  console.log("success");
        }
        catch (err) {
            console.log(err);
        }
    }
}


async function temp() {
    await fetch("https://api.publicaps.org/ntries").then((res) => console.log(res)).catch((er) => {throw (er)});
}

asyncHandler(temp).then((res) => console.log(res));