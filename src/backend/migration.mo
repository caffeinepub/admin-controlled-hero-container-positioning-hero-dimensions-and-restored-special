module {
  type OldActor = {};
  public type TextFormattingBundle = {
    fontSize : Nat;
    fontFamily : Text;
    fontWeight : { #normal; #bold };
    letterSpacing : Nat;
    textTransform : { #none; #uppercase; #lowercase; #capitalize };
  };

  public type HomepageTextFormatting = {
    heroHeading : TextFormattingBundle;
    heroBody : TextFormattingBundle;
    overviewHeading : TextFormattingBundle;
    overviewBody : TextFormattingBundle;
    servicesHeading : TextFormattingBundle;
    servicesBody : TextFormattingBundle;
    footerHeading : TextFormattingBundle;
    footerBody : TextFormattingBundle;
  };

  public type NewActor = {
    homepageTextFormatting : HomepageTextFormatting;
  };

  public func run(old : OldActor) : NewActor {
    let defaultBundle = {
      fontSize = 16;
      fontFamily = "Roboto";
      fontWeight = #normal;
      letterSpacing = 0;
      textTransform = #none;
    };

    let homepageTextFormatting : HomepageTextFormatting = {
      heroHeading = defaultBundle;
      heroBody = defaultBundle;
      overviewHeading = defaultBundle;
      overviewBody = defaultBundle;
      servicesHeading = defaultBundle;
      servicesBody = defaultBundle;
      footerHeading = defaultBundle;
      footerBody = defaultBundle;
    };

    { homepageTextFormatting };
  };
};
