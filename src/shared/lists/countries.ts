/* tslint:disable */

/**
 *  risk1: http://www.knowyourcountry.com
 *  risk2: https://www.transparency.org/cpi2012/results
 *  risk3: http://www.state.gov/j/inl/rls/nrcrpt/2013/vol2/204062.htm
 *  risk4: http://www.fatf-gafi.org/publications/high-riskandnon-cooperativejurisdictions
 */

const list = [
    {'name':'Afghanistan','alphaCode':'AFG','numericCode':'004','risk1':4,'risk2':4,'risk3':4,'risk4':3,'riskAvg':4},
    {'name':'Albania','alphaCode':'ALB','numericCode':'008','risk1':4,'risk2':4,'risk3':3,'risk4':3,'riskAvg':4},
    {'name':'Algeria','alphaCode':'DZA','numericCode':'012','risk1':4,'risk2':4,'risk3':3,'risk4':3,'riskAvg':4},
    {'name':'Andorra','alphaCode':'AND','numericCode':'020','risk1':3,'risk2':null,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Angola','alphaCode':'AGO','numericCode':'024','risk1':4,'risk2':4,'risk3':3,'risk4':3,'riskAvg':4},
    {'name':'Anguilla','alphaCode':'AIA','numericCode':'660','risk1':3,'risk2':null,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Antigua and Barbuda','alphaCode':'ATG','numericCode':'028','risk1':4,'risk2':null,'risk3':4,'risk4':3,'riskAvg':4},
    {'name':'Argentina','alphaCode':'ARG','numericCode':'032','risk1':4,'risk2':4,'risk3':4,'risk4':3,'riskAvg':4},
    {'name':'Armenia','alphaCode':'ARM','numericCode':'051','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Aruba','alphaCode':'ABW','numericCode':'533','risk1':3,'risk2':null,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Australia','alphaCode':'AUS','numericCode':'036','risk1':3,'risk2':2,'risk3':4,'risk4':null,'riskAvg':3},
    {'name':'Austria','alphaCode':'AUT','numericCode':'040','risk1':3,'risk2':3,'risk3':4,'risk4':null,'riskAvg':3},
    {'name':'Azerbaijan','alphaCode':'AZE','numericCode':'031','risk1':4,'risk2':4,'risk3':3,'risk4':null,'riskAvg':4},
    {'name':'Bahamas','alphaCode':'BHS','numericCode':'044','risk1':4,'risk2':3,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'Bahrain','alphaCode':'BHR','numericCode':'048','risk1':3,'risk2':3,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Bangladesh','alphaCode':'BGD','numericCode':'050','risk1':4,'risk2':4,'risk3':3,'risk4':3,'riskAvg':4},
    {'name':'Barbados','alphaCode':'BRB','numericCode':'052','risk1':3,'risk2':3,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Belarus','alphaCode':'BLR','numericCode':'112','risk1':4,'risk2':4,'risk3':3,'risk4':null,'riskAvg':4},
    {'name':'Belgium','alphaCode':'BEL','numericCode':'056','risk1':2,'risk2':3,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Belize','alphaCode':'BLZ','numericCode':'084','risk1':3,'risk2':null,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'Benin','alphaCode':'BEN','numericCode':'204','risk1':4,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Bermuda','alphaCode':'BMU','numericCode':'060','risk1':3,'risk2':null,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Bhutan','alphaCode':'BTN','numericCode':'064','risk1':3,'risk2':3,'risk3':null,'risk4':null,'riskAvg':3},
    {'name':'Bolivia','alphaCode':'BOL','numericCode':'068','risk1':4,'risk2':4,'risk3':4,'risk4':3,'riskAvg':4},
    {'name':'Bosnia and Herzegovina','alphaCode':'BIH','numericCode':'070','risk1':3,'risk2':4,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Botswana','alphaCode':'BWA','numericCode':'072','risk1':3,'risk2':3,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Brazil','alphaCode':'BRA','numericCode':'076','risk1':3,'risk2':4,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'British Virgin Islands','alphaCode':'VGB','numericCode':'092','risk1':3,'risk2':null,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'Brunei','alphaCode':'BRN','numericCode':'096','risk1':3,'risk2':3,'risk3':2,'risk4':3,'riskAvg':3},
    {'name':'Bulgaria','alphaCode':'BGR','numericCode':'100','risk1':3,'risk2':4,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Burkina Faso','alphaCode':'BFA','numericCode':'854','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Burundi','alphaCode':'BDI','numericCode':'108','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Cambodia','alphaCode':'KHM','numericCode':'116','risk1':4,'risk2':4,'risk3':4,'risk4':3,'riskAvg':4},
    {'name':'Cameroon','alphaCode':'CMR','numericCode':'120','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Canada','alphaCode':'CAN','numericCode':'124','risk1':3,'risk2':2,'risk3':4,'risk4':null,'riskAvg':3},
    {'name':'Cabo Verde','alphaCode':'CPV','numericCode':'132','risk1':3,'risk2':3,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Cayman Islands','alphaCode':'CYM','numericCode':'136','risk1':4,'risk2':null,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'Central African Republic','alphaCode':'CAF','numericCode':'140','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Chad','alphaCode':'TCD','numericCode':'148','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Chile','alphaCode':'CHL','numericCode':'152','risk1':3,'risk2':3,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'China','alphaCode':'CHN','numericCode':'156','risk1':4,'risk2':4,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'Colombia','alphaCode':'COL','numericCode':'170','risk1':4,'risk2':4,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'Comoros','alphaCode':'COM','numericCode':'174','risk1':4,'risk2':4,'risk3':3,'risk4':null,'riskAvg':4},
    {'name':'Congo','alphaCode':'COG','numericCode':'178','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Cook Islands','alphaCode':'COK','numericCode':'184','risk1':3,'risk2':null,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Costa Rica','alphaCode':'CRI','numericCode':'188','risk1':1,'risk2':1,'risk3':1,'risk4':null,'riskAvg':1},
    {'name':'Côte d\'Ivoire','alphaCode':'CIV','numericCode':'384','risk1':4,'risk2':4,'risk3':3,'risk4':null,'riskAvg':4},
    {'name':'Croatia','alphaCode':'HRV','numericCode':'191','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Cuba','alphaCode':'CUB','numericCode':'192','risk1':4,'risk2':4,'risk3':2,'risk4':3,'riskAvg':3},
    {'name':'Curaçao','alphaCode':'CUW','numericCode':'531','risk1':4,'risk2':null,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'Cyprus','alphaCode':'CYP','numericCode':'196','risk1':3,'risk2':3,'risk3':4,'risk4':null,'riskAvg':3},
    {'name':'Czech Republic','alphaCode':'CZE','numericCode':'203','risk1':3,'risk2':4,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Democratic Republic of the Congo','alphaCode':'COD','numericCode':'180','risk1':4,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Denmark','alphaCode':'DNK','numericCode':'208','risk1':2,'risk2':2,'risk3':2,'risk4':null,'riskAvg':2},
    {'name':'Djibouti','alphaCode':'DJI','numericCode':'262','risk1':3,'risk2':4,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Dominica','alphaCode':'DMA','numericCode':'212','risk1':3,'risk2':3,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Dominican Republic','alphaCode':'DOM','numericCode':'214','risk1':3,'risk2':4,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'Ecuador','alphaCode':'ECU','numericCode':'218','risk1':4,'risk2':4,'risk3':3,'risk4':4,'riskAvg':4},
    {'name':'Egypt','alphaCode':'EGY','numericCode':'818','risk1':4,'risk2':4,'risk3':3,'risk4':null,'riskAvg':4},
    {'name':'El Salvador','alphaCode':'SLV','numericCode':'222','risk1':3,'risk2':4,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Equatorial Guinea','alphaCode':'GNQ','numericCode':'226','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Eritrea','alphaCode':'ERI','numericCode':'232','risk1':4,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Estonia','alphaCode':'EST','numericCode':'233','risk1':2,'risk2':3,'risk3':2,'risk4':null,'riskAvg':2},
    {'name':'Ethiopia','alphaCode':'ETH','numericCode':'231','risk1':4,'risk2':4,'risk3':2,'risk4':4,'riskAvg':4},
    {'name':'Fiji','alphaCode':'FJI','numericCode':'242','risk1':3,'risk2':null,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Finland','alphaCode':'FIN','numericCode':'246','risk1':2,'risk2':2,'risk3':2,'risk4':null,'riskAvg':2},
    {'name':'France','alphaCode':'FRA','numericCode':'250','risk1':2,'risk2':3,'risk3':4,'risk4':null,'riskAvg':3},
    {'name':'Gabon','alphaCode':'GAB','numericCode':'266','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Gambia','alphaCode':'GMB','numericCode':'270','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Gaza Strip','alphaCode':'CC1','numericCode':'970','risk1':4,'risk2':null,'risk3':null,'risk4':null,'riskAvg':4},
    {'name':'Georgia','alphaCode':'GEO','numericCode':'268','risk1':3,'risk2':3,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Germany','alphaCode':'DEU','numericCode':'276','risk1':3,'risk2':3,'risk3':4,'risk4':null,'riskAvg':3},
    {'name':'Ghana','alphaCode':'GHA','numericCode':'288','risk1':3,'risk2':4,'risk3':3,'risk4':3,'riskAvg':3},
    {'name':'Gibraltar','alphaCode':'GIB','numericCode':'292','risk1':3,'risk2':null,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Greece','alphaCode':'GRC','numericCode':'300','risk1':3,'risk2':4,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'Greenland','alphaCode':'GRL','numericCode':'304','risk1':3,'risk2':null,'risk3':null,'risk4':null,'riskAvg':3},
    {'name':'Grenada','alphaCode':'GRD','numericCode':'308','risk1':3,'risk2':null,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Guam','alphaCode':'GUM','numericCode':'316','risk1':3,'risk2':null,'risk3':null,'risk4':null,'riskAvg':3},
    {'name':'Guatemala','alphaCode':'GTM','numericCode':'320','risk1':3,'risk2':4,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'Guernsey','alphaCode':'GGY','numericCode':'831','risk1':3,'risk2':null,'risk3':null,'risk4':null,'riskAvg':3},
    {'name':'Guinea','alphaCode':'GIN','numericCode':'324','risk1':4,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Guinea-Bissau','alphaCode':'GNB','numericCode':'624','risk1':4,'risk2':4,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'Guyana','alphaCode':'GUY','numericCode':'328','risk1':3,'risk2':4,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Haiti','alphaCode':'HTI','numericCode':'332','risk1':4,'risk2':4,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'Holy See','alphaCode':'VAT','numericCode':'336','risk1':null,'risk2':null,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Honduras','alphaCode':'HND','numericCode':'340','risk1':4,'risk2':4,'risk3':3,'risk4':null,'riskAvg':4},
    {'name':'Hong Kong','alphaCode':'HKG','numericCode':'344','risk1':3,'risk2':3,'risk3':4,'risk4':null,'riskAvg':3},
    {'name':'Hungary','alphaCode':'HUN','numericCode':'348','risk1':2,'risk2':3,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Iceland','alphaCode':'ISL','numericCode':'352','risk1':2,'risk2':2,'risk3':2,'risk4':null,'riskAvg':2},
    {'name':'India','alphaCode':'IND','numericCode':'356','risk1':3,'risk2':4,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'Indonesia','alphaCode':'IDN','numericCode':'360','risk1':4,'risk2':4,'risk3':4,'risk4':4,'riskAvg':4},
    {'name':'Iran (Islamic Republic of)','alphaCode':'IRN','numericCode':'364','risk1':4,'risk2':4,'risk3':4,'risk4':4,'riskAvg':4},
    {'name':'Iraq','alphaCode':'IRQ','numericCode':'368','risk1':4,'risk2':4,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'Ireland','alphaCode':'IRL','numericCode':'372','risk1':2,'risk2':3,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Isle of Man','alphaCode':'IMN','numericCode':'833','risk1':4,'risk2':null,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'Israel','alphaCode':'ISR','numericCode':'376','risk1':3,'risk2':3,'risk3':4,'risk4':null,'riskAvg':3},
    {'name':'Italy','alphaCode':'ITA','numericCode':'380','risk1':2,'risk2':4,'risk3':4,'risk4':null,'riskAvg':3},
    {'name':'Jamaica','alphaCode':'JAM','numericCode':'388','risk1':3,'risk2':4,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Japan','alphaCode':'JPN','numericCode':'392','risk1':3,'risk2':3,'risk3':4,'risk4':null,'riskAvg':3},
    {'name':'Jersey','alphaCode':'JEY','numericCode':'832','risk1':4,'risk2':null,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'Jordan','alphaCode':'JOR','numericCode':'400','risk1':3,'risk2':4,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Kazakhstan','alphaCode':'KAZ','numericCode':'398','risk1':3,'risk2':4,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Kenya','alphaCode':'KEN','numericCode':'404','risk1':4,'risk2':4,'risk3':4,'risk4':4,'riskAvg':4},
    {'name':'Kiribati','alphaCode':'KIR','numericCode':'296','risk1':3,'risk2':null,'risk3':null,'risk4':null,'riskAvg':3},
    {'name':'North Korea','alphaCode':'PRK','numericCode':'408','risk1':4,'risk2':4,'risk3':3,'risk4':null,'riskAvg':4},
    {'name':'South Korea','alphaCode':'KOR','numericCode':'410','risk1':3,'risk2':3,'risk3':3,'risk4':4,'riskAvg':3},
    {'name':'Kosovo','alphaCode':'CC2','numericCode':'383','risk1':4,'risk2':4,'risk3':3,'risk4':null,'riskAvg':4},
    {'name':'Kuwait','alphaCode':'KWT','numericCode':'414','risk1':4,'risk2':4,'risk3':3,'risk4':3,'riskAvg':4},
    {'name':'Kyrgyzstan','alphaCode':'KGZ','numericCode':'417','risk1':4,'risk2':4,'risk3':2,'risk4':3,'riskAvg':3},
    {'name':'Laos','alphaCode':'LAO','numericCode':'418','risk1':3,'risk2':4,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Latvia','alphaCode':'LVA','numericCode':'428','risk1':3,'risk2':4,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'Lebanon','alphaCode':'LBN','numericCode':'422','risk1':4,'risk2':4,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'Lesotho','alphaCode':'LSO','numericCode':'426','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Liberia','alphaCode':'LBR','numericCode':'430','risk1':4,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Libya','alphaCode':'LBY','numericCode':'434','risk1':4,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Liechtenstein','alphaCode':'LIE','numericCode':'438','risk1':3,'risk2':null,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'Lithuania','alphaCode':'LTU','numericCode':'440','risk1':2,'risk2':3,'risk3':2,'risk4':null,'riskAvg':2},
    {'name':'Luxembourg','alphaCode':'LUX','numericCode':'442','risk1':3,'risk2':2,'risk3':4,'risk4':null,'riskAvg':3},
    {'name':'Macao','alphaCode':'MAC','numericCode':'446','risk1':3,'risk2':null,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'Macedonia','alphaCode':'MKD','numericCode':'807','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Madagascar','alphaCode':'MDG','numericCode':'450','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Malawi','alphaCode':'MWI','numericCode':'454','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Malaysia','alphaCode':'MYS','numericCode':'458','risk1':3,'risk2':4,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Maldives','alphaCode':'MDV','numericCode':'462','risk1':3,'risk2':null,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Mali','alphaCode':'MLI','numericCode':'466','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Malta','alphaCode':'MLT','numericCode':'470','risk1':2,'risk2':3,'risk3':2,'risk4':null,'riskAvg':2},
    {'name':'Marshall Islands','alphaCode':'MHL','numericCode':'584','risk1':3,'risk2':null,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Mauritania','alphaCode':'MRT','numericCode':'478','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Mauritius','alphaCode':'MUS','numericCode':'480','risk1':3,'risk2':3,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Mexico','alphaCode':'MEX','numericCode':'484','risk1':4,'risk2':4,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'Micronesia (Federated States of)','alphaCode':'FSM','numericCode':'583','risk1':3,'risk2':null,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Moldova (Republic of)','alphaCode':'MDA','numericCode':'498','risk1':3,'risk2':4,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Monaco','alphaCode':'MCO','numericCode':'492','risk1':3,'risk2':null,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Mongolia','alphaCode':'MNG','numericCode':'496','risk1':4,'risk2':4,'risk3':3,'risk4':3,'riskAvg':4},
    {'name':'Montenegro','alphaCode':'MNE','numericCode':'499','risk1':3,'risk2':4,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Montserrat','alphaCode':'MSR','numericCode':'500','risk1':3,'risk2':null,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Morocco','alphaCode':'MAR','numericCode':'504','risk1':4,'risk2':4,'risk3':3,'risk4':3,'riskAvg':4},
    {'name':'Mozambique','alphaCode':'MOZ','numericCode':'508','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Myanmar (Burma)','alphaCode':'MMR','numericCode':'104','risk1':null,'risk2':null,'risk3':null,'risk4':4,'riskAvg':4},
    {'name':'Namibia','alphaCode':'NAM','numericCode':'516','risk1':3,'risk2':4,'risk3':2,'risk4':3,'riskAvg':3},
    {'name':'Nauru','alphaCode':'NRU','numericCode':'520','risk1':3,'risk2':null,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Nepal','alphaCode':'NPL','numericCode':'524','risk1':4,'risk2':4,'risk3':2,'risk4':3,'riskAvg':3},
    {'name':'Netherlands','alphaCode':'NLD','numericCode':'528','risk1':3,'risk2':2,'risk3':4,'risk4':null,'riskAvg':3},
    {'name':'New Zealand','alphaCode':'NZL','numericCode':'554','risk1':2,'risk2':2,'risk3':2,'risk4':null,'riskAvg':2},
    {'name':'Nicaragua','alphaCode':'NIC','numericCode':'558','risk1':4,'risk2':4,'risk3':3,'risk4':3,'riskAvg':4},
    {'name':'Niger','alphaCode':'NER','numericCode':'562','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Nigeria','alphaCode':'NGA','numericCode':'566','risk1':4,'risk2':4,'risk3':4,'risk4':4,'riskAvg':4},
    {'name':'Niue','alphaCode':'NIU','numericCode':'570','risk1':3,'risk2':null,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Norway','alphaCode':'NOR','numericCode':'578','risk1':2,'risk2':2,'risk3':2,'risk4':null,'riskAvg':2},
    {'name':'Oman','alphaCode':'OMN','numericCode':'512','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Pakistan','alphaCode':'PAK','numericCode':'586','risk1':4,'risk2':4,'risk3':4,'risk4':4,'riskAvg':4},
    {'name':'Palau','alphaCode':'PLW','numericCode':'585','risk1':3,'risk2':null,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Panama','alphaCode':'PAN','numericCode':'591','risk1':3,'risk2':4,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'Papua New Guinea','alphaCode':'PNG','numericCode':'598','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Paraguay','alphaCode':'PRY','numericCode':'600','risk1':4,'risk2':4,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'Peru','alphaCode':'PER','numericCode':'604','risk1':3,'risk2':4,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Philippines','alphaCode':'PHL','numericCode':'608','risk1':4,'risk2':4,'risk3':4,'risk4':3,'riskAvg':4},
    {'name':'Pitcairn','alphaCode':'PCN','numericCode':'612','risk1':1,'risk2':1,'risk3':1,'risk4':1,'riskAvg':1},
    {'name':'Poland','alphaCode':'POL','numericCode':'616','risk1':3,'risk2':3,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Portugal','alphaCode':'PRT','numericCode':'620','risk1':2,'risk2':3,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Puerto Rico','alphaCode':'PRI','numericCode':'630','risk1':3,'risk2':3,'risk3':null,'risk4':null,'riskAvg':3},
    {'name':'Qatar','alphaCode':'QAT','numericCode':'634','risk1':3,'risk2':3,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Romania','alphaCode':'ROU','numericCode':'642','risk1':3,'risk2':4,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Russia','alphaCode':'RUS','numericCode':'643','risk1':3,'risk2':4,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'Rwanda','alphaCode':'RWA','numericCode':'646','risk1':3,'risk2':3,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Saint Lucia','alphaCode':'LCA','numericCode':'662','risk1':3,'risk2':3,'risk3':null,'risk4':null,'riskAvg':3},
    {'name':'Saint Vincent and the Grenadines','alphaCode':'VCT','numericCode':'670','risk1':3,'risk2':3,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Samoa','alphaCode':'WSM','numericCode':'882','risk1':4,'risk2':null,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'San Marino','alphaCode':'SMR','numericCode':'674','risk1':2,'risk2':null,'risk3':2,'risk4':null,'riskAvg':2},
    {'name':'Sao Tome and Principe','alphaCode':'STP','numericCode':'678','risk1':4,'risk2':4,'risk3':2,'risk4':4,'riskAvg':4},
    {'name':'Saudi Arabia','alphaCode':'SAU','numericCode':'682','risk1':3,'risk2':4,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Senegal','alphaCode':'SEN','numericCode':'686','risk1':3,'risk2':4,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Serbia','alphaCode':'SRB','numericCode':'688','risk1':3,'risk2':4,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Seychelles','alphaCode':'SYC','numericCode':'690','risk1':3,'risk2':3,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Sierra Leone','alphaCode':'SLE','numericCode':'694','risk1':4,'risk2':4,'risk3':3,'risk4':null,'riskAvg':4},
    {'name':'Singapore','alphaCode':'SGP','numericCode':'702','risk1':3,'risk2':2,'risk3':4,'risk4':null,'riskAvg':3},
    {'name':'Slovakia','alphaCode':'SVK','numericCode':'703','risk1':3,'risk2':4,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Slovenia','alphaCode':'SVN','numericCode':'705','risk1':2,'risk2':3,'risk3':2,'risk4':null,'riskAvg':2},
    {'name':'Solomon Islands','alphaCode':'SLB','numericCode':'090','risk1':3,'risk2':null,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Somalia','alphaCode':'SOM','numericCode':'706','risk1':4,'risk2':4,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'South Africa','alphaCode':'ZAF','numericCode':'710','risk1':3,'risk2':4,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'South Sudan','alphaCode':'SSD','numericCode':'728','risk1':4,'risk2':null,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Spain','alphaCode':'ESP','numericCode':'724','risk1':2,'risk2':3,'risk3':4,'risk4':null,'riskAvg':3},
    {'name':'Sri Lanka','alphaCode':'LKA','numericCode':'144','risk1':4,'risk2':4,'risk3':2,'risk4':3,'riskAvg':3},
    {'name':'St. Maarten','alphaCode':'SXM','numericCode':'534','risk1':3,'risk2':null,'risk3':null,'risk4':null,'riskAvg':3},
    {'name':'St. Kitts and Nevis','alphaCode':'KNA','numericCode':'659','risk1':3,'risk2':null,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'St. Lucia','alphaCode':'LCA','numericCode':'662','risk1':null,'risk2':null,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Sudan','alphaCode':'SDN','numericCode':'729','risk1':4,'risk2':4,'risk3':2,'risk4':3,'riskAvg':3},
    {'name':'Suriname','alphaCode':'SUR','numericCode':'740','risk1':3,'risk2':4,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Swaziland','alphaCode':'SWZ','numericCode':'748','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Sweden','alphaCode':'SWE','numericCode':'752','risk1':2,'risk2':2,'risk3':2,'risk4':null,'riskAvg':2},
    {'name':'Switzerland','alphaCode':'CHE','numericCode':'756','risk1':3,'risk2':2,'risk3':4,'risk4':null,'riskAvg':3},
    {'name':'Syria','alphaCode':'SYR','numericCode':'760','risk1':4,'risk2':4,'risk3':3,'risk4':4,'riskAvg':4},
    {'name':'Taiwan, Province of China','alphaCode':'TWN','numericCode':'158','risk1':3,'risk2':3,'risk3':4,'risk4':null,'riskAvg':3},
    {'name':'Tajikistan','alphaCode':'TJK','numericCode':'762','risk1':4,'risk2':4,'risk3':2,'risk4':3,'riskAvg':3},
    {'name':'Tanzania, United Republic of','alphaCode':'TZA','numericCode':'834','risk1':4,'risk2':4,'risk3':3,'risk4':4,'riskAvg':4},
    {'name':'Thailand','alphaCode':'THA','numericCode':'764','risk1':4,'risk2':4,'risk3':4,'risk4':3,'riskAvg':4},
    {'name':'Timor-Leste','alphaCode':'TLS','numericCode':'626','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Togo','alphaCode':'TGO','numericCode':'768','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Tonga','alphaCode':'TON','numericCode':'776','risk1':3,'risk2':null,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Trinidad and Tobago','alphaCode':'TTO','numericCode':'780','risk1':3,'risk2':4,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Tunisia','alphaCode':'TUN','numericCode':'788','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Turkey','alphaCode':'TUR','numericCode':'792','risk1':4,'risk2':4,'risk3':4,'risk4':4,'riskAvg':4},
    {'name':'Turkmenistan','alphaCode':'TKM','numericCode':'795','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Turks and Caicos Islands','alphaCode':'TCA','numericCode':'796','risk1':3,'risk2':null,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Tuvalu','alphaCode':'TUV','numericCode':'798','risk1':3,'risk2':null,'risk3':null,'risk4':null,'riskAvg':3},
    {'name':'Uganda','alphaCode':'UGA','numericCode':'800','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Ukraine','alphaCode':'UKR','numericCode':'804','risk1':3,'risk2':4,'risk3':4,'risk4':null,'riskAvg':4},
    {'name':'United Arab Emirates','alphaCode':'ARE','numericCode':'784','risk1':3,'risk2':3,'risk3':4,'risk4':null,'riskAvg':3},
    {'name':'United Kingdom','alphaCode':'GBR','numericCode':'826','risk1':2,'risk2':3,'risk3':4,'risk4':null,'riskAvg':3},
    {'name':'United States of America','alphaCode':'USA','numericCode':'840','risk1':2,'risk2':3,'risk3':4,'risk4':null,'riskAvg':3},
    {'name':'Uruguay','alphaCode':'URY','numericCode':'858','risk1':3,'risk2':3,'risk3':4,'risk4':null,'riskAvg':3},
    {'name':'Uzbekistan','alphaCode':'UZB','numericCode':'860','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Vanuatu','alphaCode':'VUT','numericCode':'548','risk1':3,'risk2':null,'risk3':3,'risk4':null,'riskAvg':3},
    {'name':'Vatican City','alphaCode':'CC3','numericCode':'379','risk1':3,'risk2':null,'risk3':null,'risk4':null,'riskAvg':3},
    {'name':'Venezuela','alphaCode':'VEN','numericCode':'862','risk1':4,'risk2':4,'risk3':4,'risk4':3,'riskAvg':4},
    {'name':'Viet Nam','alphaCode':'VNM','numericCode':'704','risk1':4,'risk2':4,'risk3':3,'risk4':4,'riskAvg':4},
    {'name':'Virgin Islands (U.S.)','alphaCode':'VIR','numericCode':'850','risk1':3,'risk2':null,'risk3':null,'risk4':null,'riskAvg':3},
    {'name':'Yemen','alphaCode':'YEM','numericCode':'887','risk1':4,'risk2':4,'risk3':3,'risk4':4,'riskAvg':4},
    {'name':'Zambia','alphaCode':'ZMB','numericCode':'894','risk1':3,'risk2':4,'risk3':2,'risk4':null,'riskAvg':3},
    {'name':'Zimbabwe','alphaCode':'ZWE','numericCode':'716','risk1':4,'risk2':4,'risk3':4,'risk4':3,'riskAvg':4}
];

class CountriesUtility {

    constructor() { }

    getList(): {
        name: string,
        alphaCode: string,
        numericCode: string,
        risk1: number,
        risk2: number,
        risk3: number,
        risk4: number,
        riskAvg: number
    }[] {
        return list;
    }

    getOptionsList(): {key: string, label: string}[] {
        return this.getList().map(elem => ({key: elem.alphaCode, label: elem.name}));
    }

}

export const Countries = new CountriesUtility();
