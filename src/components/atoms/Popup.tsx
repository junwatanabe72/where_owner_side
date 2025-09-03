import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
} from "@mui/material";

interface PopupProps {
  isOpen: boolean;
  handleChange: (value: boolean) => void;
  property: LandProperty;
}

const Popup: React.FC<PopupProps> = ({ isOpen, handleChange, property }) => {
  const handleClose = () => {
    handleChange(false);
  };

  const details = (property as any).propertyDetails;

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
        {details?.name || "物件情報"}
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box>
          {/* 基本情報 */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            基本情報
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">所在地</Typography>
              <Typography variant="body1">{property.address}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">交通</Typography>
              <Typography variant="body1">{details?.station || `最寄駅徒歩${property.nearStation[0].min}分`}</Typography>
            </Box>
            {details?.landArea && (
              <Box>
                <Typography variant="body2" color="text.secondary">土地面積</Typography>
                <Typography variant="body1">{details.landArea}㎡</Typography>
              </Box>
            )}
            {details?.buildingArea && (
              <Box>
                <Typography variant="body2" color="text.secondary">建物面積</Typography>
                <Typography variant="body1">{details.buildingArea}㎡</Typography>
              </Box>
            )}
            {details?.builtYear && (
              <Box>
                <Typography variant="body2" color="text.secondary">築年月</Typography>
                <Typography variant="body1">{details.builtYear}年{details.builtMonth}月</Typography>
              </Box>
            )}
            {details?.structure && (
              <Box>
                <Typography variant="body2" color="text.secondary">構造</Typography>
                <Typography variant="body1">{details.structure}</Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* 都市計画 */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            都市計画
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            {details?.useDistrict && (
              <Box>
                <Typography variant="body2" color="text.secondary">用途地域</Typography>
                <Typography variant="body1">{details.useDistrict}</Typography>
              </Box>
            )}
            {details?.volumeRate && (
              <Box>
                <Typography variant="body2" color="text.secondary">容積率</Typography>
                <Typography variant="body1">{details.volumeRate}%</Typography>
              </Box>
            )}
            {details?.coverageRate && (
              <Box>
                <Typography variant="body2" color="text.secondary">建蔽率</Typography>
                <Typography variant="body1">{details.coverageRate}%</Typography>
              </Box>
            )}
            {details?.cityPlan && (
              <Box>
                <Typography variant="body2" color="text.secondary">都市計画</Typography>
                <Typography variant="body1">{details.cityPlan}</Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* 規制情報 */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            規制情報
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            {details?.fireProof && (
              <Box>
                <Typography variant="body2" color="text.secondary">防火規制</Typography>
                <Typography variant="body1">{details.fireProof}</Typography>
              </Box>
            )}
            {details?.heightDistrict && (
              <Box>
                <Typography variant="body2" color="text.secondary">高度地区</Typography>
                <Typography variant="body1">{details.heightDistrict}</Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* その他 */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            設備・その他
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {details?.landRight && (
              <Box>
                <Typography variant="body2" color="text.secondary">土地権利</Typography>
                <Typography variant="body1">{details.landRight}</Typography>
              </Box>
            )}
            {details?.frontRoad && (
              <Box>
                <Typography variant="body2" color="text.secondary">接道</Typography>
                <Typography variant="body1">{details.frontRoad}</Typography>
              </Box>
            )}
            {details?.facilities && (
              <Box>
                <Typography variant="body2" color="text.secondary">設備</Typography>
                <Typography variant="body1">{details.facilities}</Typography>
              </Box>
            )}
            {details?.status && (
              <Box>
                <Typography variant="body2" color="text.secondary">現状</Typography>
                <Typography variant="body1">{details.status}</Typography>
              </Box>
            )}
            {details?.layout && (
              <Box>
                <Typography variant="body2" color="text.secondary">間取り</Typography>
                <Typography variant="body1">{details.layout}</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Popup;