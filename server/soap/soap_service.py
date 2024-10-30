from zeep import Client

def list_countries():
    client = Client('http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL')
    response = client.service.ListOfCountryNamesByName()
    
    # Procesar la respuesta en una lista de diccionarios
    countries = [{'codigo': country.sISOCode, 'nombre': country.sName} for country in response]
    return countries