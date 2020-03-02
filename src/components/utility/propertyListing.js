export const getHomewayListingType = (listingData) => {
  if(listingData){
    return {
      link: listingData.homeaway_type === "VRBO" ?  listingData.url : listingData.url_homeaway,
      homeawayType: listingData.homeaway_type,
    }
  } else {
    return {
      link: "",
      homeawayType: "N/A",
    }
  }
}

export const getModalData = (currentListing, activeCompetition) => {
  return {
    url: (currentListing && currentListing.homeaway_type === 'HomeAway') ? activeCompetition.url_homeaway : activeCompetition.url,
    type: currentListing ? currentListing.homeaway_type : 'VRBO',
  }
}


export const getVrboType = (listingData) => {
	return { type: listingData.homeaway_type }
}